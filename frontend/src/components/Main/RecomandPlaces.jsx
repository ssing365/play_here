import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import axios from "axios";
import { Carousel, Row, Col, Card, Button } from "react-bootstrap";
import "../../css/Recommand.css";
import { useNavigate } from "react-router-dom"; // 🔥 React Router 사용


const RecomandPlaces = () => {
    const [recommendations, setRecommendations] = useState([]); 
    const { userInfo, isLoggedIn } = useContext(UserContext); 
    const [selectedCategory, setSelectedCategory] = useState("식당 & 카페");
    const navigate = useNavigate(); // 🔥 네비게이션 함수 가져오기

    const categoryMapping = {
        "식당 & 카페": { min: 1, max: 14 },
        "가볼만한 곳": { min: 15, max: 29 },
        "축제, 공연": { min: 15, max: 29 },
    };

    useEffect(() => {
        const fetchRecommendations = async () => {
            const userId = isLoggedIn ? userInfo.userId : "guest"; 
            console.log(`🟡 API 요청 - userId: ${userId}`);

            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/recommend/${userId}`);
                console.log("🟢 API 응답 데이터:", response.data);

                if (!response.data || response.data.length === 0) {
                    console.warn("⚠️ API에서 추천 장소가 비어 있음! 기본 데이터 사용");
                    setRecommendations([
                        { PLACE_ID: 1, PLACE_NAME: "기본 장소 1", IMAGE: "/images/default.png", LOCATION: "서울 강남구", PREFERENCE_ID: 1 },
                        { PLACE_ID: 2, PLACE_NAME: "기본 장소 2", IMAGE: "/images/default.png", LOCATION: "서울 종로구", PREFERENCE_ID: 15 },
                        { PLACE_ID: 3, PLACE_NAME: "기본 장소 3", IMAGE: "/images/default.png", LOCATION: "부산 해운대구", PREFERENCE_ID: 25 }
                    ]);
                } else {
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
        if (!prefId || !imageUrl || imageUrl.includes("via.placeholder")) return false;
    
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

    return (
        <div>
            <h4 style={{ fontWeight: "bold", color: "#000000", marginTop: "20px" }}>
                {isLoggedIn ? `${userInfo?.nickname || "Loading..."} 님을 위한 추천` : "지금 가기 좋은 곳"}
            </h4>

            <div className="d-flex gap-3 mb-3">
                {Object.keys(categoryMapping).map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? "dark" : "outline-dark"}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {console.log("🔥 최종 chunkedRecommendations:", chunkedRecommendations)}

            {chunkedRecommendations.length > 0 ? (
                <Carousel interval={5000} indicators={false} controls={true}>
                    {chunkedRecommendations.map((group, index) => (
                        <Carousel.Item key={`carousel-${index}`}>
                            {console.log(`🚀 Carousel Group ${index} - Data:`, group)}
                            <Row className="mb-4 d-flex justify-content-center">
                                {group.map((place, idx) => (
                                    <Col key={`place-${place.PLACE_ID || place.place_id || idx}`} md={4} className="mb-3">
                                        <div className="image-container"
                                            onClick={() => navigate(`/search?place_id=${place.PLACE_ID || place.place_id}`)} // 🔥 클릭 시 이동
                                            style={{ cursor: "pointer" }} >
                                            {console.log("📸 이미지 URL 확인:", place.IMAGE, " | 장소명:", place.PLACE_NAME)}
                                            <Card.Img
                                                src={place.IMAGE || place.image || "/images/default.png"}
                                                alt={place.PLACE_NAME || place.place_name || "이름 없음"}
                                                onError={(e) => { e.target.src = "/images/default.png"; }} 
                                                className="image"
                                            />
                                            <div className="overlay">
                                                <h5 className="place-name">{place.PLACE_NAME || place.place_name || "이름 없음"}</h5>
                                                <p className="place-location">
                                                    {extractCityDistrict(place.LOCATION || place.location)}
                                                </p>

                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Carousel.Item>
                    ))}
                </Carousel>
                
            ) : (
                <p>추천된 장소가 없습니다.</p>
            )}


        </div>
    );
};

export default RecomandPlaces;
