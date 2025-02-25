import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../contexts/UserContext";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import axios from "axios";
import { Carousel, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import "../../css/Recommand.css";
import { useNavigate } from "react-router-dom"; // 🔥 React Router 사용

const RecomandPlaces = () => {
    const [recommendations, setRecommendations] = useState([]);
    const { userInfo, isLoggedIn } = useContext(UserContext);
    const [selectedCategory, setSelectedCategory] = useState("식당 & 카페");
    const navigate = useNavigate(); // 🔥 네비게이션 함수 가져오기
    const [loading, setLoading] = useState(true);

    const categoryMapping = {
        "식당 & 카페": { min: 1, max: 14 },
        "가볼만한 곳": { min: 14, max: 29 },
    };

    useEffect(() => {
        const fetchRecommendations = async () => {
            const userId = isLoggedIn ? userInfo.userId : "guest";
            console.log(`🟡 API 요청 - userId: ${userId}`);

            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/recommend/${userId}`
                );
                console.log("🟢 API 응답 데이터:", response.data);

                if (!response.data || response.data.length === 0) {
                    console.warn(
                        "⚠️ API에서 추천 장소가 비어 있음! 기본 데이터 사용"
                    );
                    setRecommendations([
                        {
                            PLACE_ID: 1,
                            PLACE_NAME: "기본 장소 1",
                            IMAGE: "/images/default.png",
                            LOCATION: "서울 강남구",
                            PREFERENCE_ID: 1,
                        },
                        {
                            PLACE_ID: 2,
                            PLACE_NAME: "기본 장소 2",
                            IMAGE: "/images/default.png",
                            LOCATION: "서울 종로구",
                            PREFERENCE_ID: 15,
                        },
                        {
                            PLACE_ID: 3,
                            PLACE_NAME: "기본 장소 3",
                            IMAGE: "/images/default.png",
                            LOCATION: "부산 해운대구",
                            PREFERENCE_ID: 25,
                        },
                    ]);
                } else {
                    console.log("adsfadf", response.data);
                    setRecommendations(response.data);
                }
            } catch (error) {
                console.error("🔴 추천 장소 요청 실패:", error);
                setRecommendations([]);
            }
        };
        fetchRecommendations();
    }, [userInfo, isLoggedIn]);

    const { min, max } = categoryMapping[selectedCategory];

    const filteredRecommendations = recommendations.filter((place) => {
        const prefId = place.PREFERENCE_ID || place.preference_id;
        const imageUrl = place.IMAGE || place.image; // 이미지 URL 확인

        // 🚨 값이 없거나 기본 placeholder 이미지면 제외
        if (!prefId || !imageUrl || imageUrl.includes("via.placeholder"))
            return false;

        const numPrefId = Number(prefId);
        return !isNaN(numPrefId) && numPrefId >= min && numPrefId <= max;
    });

    console.log("🔵 최종 필터링된 추천 장소:", filteredRecommendations);

    const extractCityDistrict = (location) => {
        if (!location) return "";
        const parts = location.split(" ");
        return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : location;
    };
    const chunkedRecommendations = [];
    for (let i = 0; i < Math.min(filteredRecommendations.length, 9); i += 3) {
        chunkedRecommendations.push(filteredRecommendations.slice(i, i + 3));
    }

    useEffect(() => {
        if (chunkedRecommendations.length > 0) {
            setLoading(false);
        }
    }, [chunkedRecommendations]);
    const carouselRef = useRef(null); // 🔥 Carousel을 직접 조작할 ref 추가

    return (
        <div>
            {/* 제목 영역 */}
            <h4
                style={{
                    fontWeight: "bold",
                    color: "#000000",
                    marginTop: "20px",
                }}
            >
                <span style={{ fontSize: "28px", color: "#e91e63" }}>
                    여놀콕콕{" "}
                </span>
                {isLoggedIn ? (
                    <span style={{ fontSize: "18px", marginLeft: "8px" }}>
                        | {userInfo?.nickname || "Loading..."} 님을 위한 추천
                    </span>
                ) : (
                    <span style={{ fontSize: "18px", marginLeft: "8px" }}>
                        | AI추천장소를 알려드릴게요
                    </span>
                )}
            </h4>

            {/* 카테고리 버튼 */}
            <div className="d-flex gap-3 mb-3">
                {Object.keys(categoryMapping).map((category) => (
                    <Button
                        key={category}
                        variant={
                            selectedCategory === category
                                ? "dark"
                                : "outline-dark"
                        }
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {console.log(
                "🔥 최종 chunkedRecommendations:",
                chunkedRecommendations
            )}

            {loading ? (
                // 로딩 컴포넌트
                <div className="loading-container">
                    <Spinner animation="border" variant="danger" />
                    <p>추천 장소를 불러오는 중...</p>
                </div>
            ) : (
                <>
                    {/* Carousel 컴포넌트 (내부 화살표 제거 위해 controls={false} 설정) */}
                    <Carousel
                        ref={carouselRef}
                        interval={8000}
                        indicators={false}
                        controls={false}
                    >
                        {chunkedRecommendations.map((group, index) => (
                            <Carousel.Item key={`carousel-${index}`}>
                                {console.log(
                                    `🚀 Carousel Group ${index} - Data:`,
                                    group
                                )}
                                <Row className="mb-4 d-flex justify-content-center">
                                    {group.map((place, idx) => (
                                        <Col
                                            key={`place-${
                                                place.PLACE_ID ||
                                                place.place_id ||
                                                idx
                                            }`}
                                            md={4}
                                        >
                                            <div
                                                className="image-container"
                                                onClick={() =>
                                                    navigate(
                                                        `/place?id=${
                                                            place.PLACE_ID ||
                                                            place.place_id
                                                        }`
                                                    )
                                                }
                                                style={{ cursor: "pointer" }}
                                            >
                                                {console.log(
                                                    "📸 이미지 URL 확인:",
                                                    place.IMAGE,
                                                    " | 장소명:",
                                                    place.PLACE_NAME
                                                )}
                                                <Card.Img
                                                    src={
                                                        place.IMAGE ||
                                                        place.image ||
                                                        "/images/default.png"
                                                    }
                                                    alt={
                                                        place.PLACE_NAME ||
                                                        place.place_name ||
                                                        "이름 없음"
                                                    }
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "/images/default.png";
                                                    }}
                                                    className="image"
                                                />
                                                <div className="overlay">
                                                    <h5 className="place-name">
                                                        {place.PLACE_NAME ||
                                                            place.place_name ||
                                                            "이름 없음"}
                                                    </h5>
                                                    <p className="place-location">
                                                        {extractCityDistrict(
                                                            place.LOCATION ||
                                                                place.location
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </Carousel.Item>
                        ))}
                    </Carousel>

                    {/* 새로 추가한 컨트롤 버튼 영역 (사진 아래에 위치) */}
                    <div className="d-flex justify-content-center gap-3 mb-3">
                        <Button
                            variant="outline-dark"
                            size="sm"
                            onClick={() => carouselRef.current.prev()}
                        >
                            <ChevronLeft />
                        </Button>
                        <Button
                            variant="outline-dark"
                            size="sm"
                            onClick={() => carouselRef.current.next()}
                        >
                            <ChevronRight />
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default RecomandPlaces;
