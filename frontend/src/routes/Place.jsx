import { useEffect, useState, useContext, useRef } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Heart, Share, MapPin } from "lucide-react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import TopBar from "../components/TopBar";
import Swal from "sweetalert2";
import "../css/Place.css";

const { kakao } = window;

function Place() {
    const [place, setPlace] = useState([]);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [tempDate, setTempDate] = useState(null); // 임시 날짜 저장
    //const [selectedDates, setSelectedDates] = useState({}); // 최종 선택된 날짜
    const location = useLocation();
    const navigate = useNavigate();
    const { userInfo, isLoggedIn } = useContext(UserContext);
    const userId = userInfo?.userId;
    const coupleId = userInfo?.coupleId;
    const queryParams = new URLSearchParams(location.search);
    const placeId = queryParams.get("id");
    const datepickerRef = useRef(null);

    useEffect(() => {
        if (!place || !place.latitude || !place.longitude) return; // place가 없으면 실행 X

        const container = document.getElementById("map");
        if (!container) return;

        const options = {
            center: new window.kakao.maps.LatLng(
                place.latitude,
                place.longitude
            ),
            level: 3,
        };

        const imageSrc = "../../images/marker.svg"; // 마커이미지의 주소입니다
        const imageSize = new kakao.maps.Size(64, 69); // 마커이미지의 크기입니다
        const imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다.
        const markerImage = new kakao.maps.MarkerImage(
            imageSrc,
            imageSize,
            imageOption
        );

        const map = new window.kakao.maps.Map(container, options);

        // 마커 추가
        const marker = new window.kakao.maps.Marker({
            position: options.center,
            image: markerImage,
        });
        marker.setMap(map);
    }, [place]);

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8586/placeView.do?id=${placeId}`
                );
                console.log(response.data);
                setPlace(response.data[0]); // 받아온 데이터를 상태에 저장
            } catch (error) {
                console.error("Error fetching place:", error);
            }
        };
        fetchPlace();
    }, [placeId]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                openDatePicker !== false &&
                datepickerRef.current &&
                !datepickerRef.current.contains(event.target)
            ) {
                handleDatePickerToggle(false); // DatePicker 닫기
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDatePicker]);

    // 좋아요 클릭 시 처리
    const handleLikeClick = async (PlaceId, e) => {
        if (!isLoggedIn) {
            e.preventDefault(); // 기본 페이지 이동 막기
            Swal.fire({
                icon: "warning",
                title: "로그인을 해주세요",
                text: "좋아요를 이용하려면 로그인이 필요합니다.",

                showCancelButton: true,
                confirmButtonText: "로그인하기",
                confirmButtonColor: "#e91e63",
                cancelButtonText: "닫기",
                cancelButtonColor: "#666666",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login");
                }
            });
        } else {
            try {
                const response = await axios.post(
                    "http://localhost:8586/placeLike.do",
                    {
                        PlaceId,
                        userId,
                    }
                );
                if (response.status === 200) {
                    Swal.fire({
                        title: "좋아요 리스트에 추가되었습니다",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            } catch (error) {
                alert("좋아요에 실패했습니다. 잠시후 다시 시도해주세요.");
                console.error("좋아요 요청 중 오류 발생:", error);
            }
        }
    };

    // 캘린더 열기/닫기
    const handleDatePickerToggle = () => {
        setTempDate(new Date()); // 기본값: 오늘 날짜
        setOpenDatePicker((prev) => !prev);
        setTimeout(() => {
            if (datepickerRef.current) {
                datepickerRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
        }, 100); // 살짝 딜레이 줘서 자연스럽게 스크롤
    };

    // 캘린더에 일정 추가 submit
    const handleConfirmDate = async (placeId, visitDate) => {
        if (userInfo?.coupleStatus === 0) {
            // e.preventDefault(); // 기본 페이지 이동 막기
            Swal.fire({
                icon: "warning",
                title: "커플 연결을 해주세요",
                text: "캘린더를 이용하려면 커플 연결을 해야합니다.",

                showCancelButton: true,
                confirmButtonText: "커플 연결하기",
                confirmButtonColor: "#e91e63",
                cancelButtonText: "닫기",
                cancelButtonColor: "#666666",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/connect-couple");
                }
            });
        } else {
            try {
                await axios.post("http://localhost:8586/addCalendar.do", {
                    placeId,
                    coupleId,
                    visitDate,
                    userId,
                });
                setOpenDatePicker(false); // DatePicker 닫기
                // 성공 알림
                Swal.fire({
                    title: "캘린더에 성공적으로 추가되었습니다!",
                    icon: "success",

                    showCancelButton: true,
                    confirmButtonColor: "#e91e63",
                    cancelButtonColor: "#666",
                    confirmButtonText: "캘린더 보러가기",
                    cancelButtonText: "닫기",
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/calendar");
                    }
                });
            } catch (error) {
                console.error("캘린더 추가 요청 중 오류 발생:", error);
                alert("캘린더 추가 중 오류가 발생했습니다."); // 실패 알림
                setOpenDatePicker(false); // 오류 발생 시에도 DatePicker 닫기
            }
        }
    };

    let hashTag = [];
    if (place.hashtag) {
        for (let j = 0; j < place.hashtag.length; j++) {
            hashTag.push(<p className="text-secondary">{place.hashtag[j]}</p>);
        }
    }

    return (
        <>
            {/* 헤더 */}
            <TopBar />
            <Container fluid className="custom-background min-vh-100">
                {/* 본문 */}
                <Container className="content-container">
                    <img
                        src={place.image}
                        alt={place.place_name}
                        className="w-100 rounded-3 mb-4"
                        style={{
                            height: "500px",
                            objectFit: "cover",
                            width: "100%",
                        }}
                    />

                    <Row className="g-4">
                        {/* 기본 정보 */}
                        <Col md={6}>
                            <h2 className="fw-bold">{place.place_name}</h2>
                            <p className="text-muted">{place.location_short}</p>
                            <div className="hashtags">
                                {hashTag.map((tag, index) => {
                                    return (
                                        <span key={index} className="hashtag">
                                            {tag.props.children}
                                        </span>
                                    );
                                })}
                            </div>
                        </Col>
                        <Col md={6} className="text-end">
                            <Button
                                variant="outline-secondary"
                                className="me-2"
                            >
                                <Share size={20} />
                            </Button>
                            <Button
                                variant="outline-danger"
                                className="me-2"
                                onClick={(e) => handleLikeClick(placeId, e)}
                            >
                                <Heart size={20} />
                            </Button>
                            {/* ✅ 캘린더 버튼만 감싸서 위치 기준 조정 */}
                            <div className="calendar-container position-relative d-inline-block">
                                <Button
                                    variant="success"
                                    onClick={handleDatePickerToggle}
                                >
                                    캘린더에 일정 추가하기
                                </Button>

                                {openDatePicker && (
                                    <div
                                        ref={datepickerRef}
                                        className="datepicker-popup position-absolute p-3 bg-white border rounded shadow mt-2"
                                        style={{ zIndex: 10 }}
                                    >
                                        {/* 캘린더 */}
                                        <DatePicker
                                            inline
                                            dateFormat="yyyy-MM-dd"
                                            selected={tempDate}
                                            onChange={(date) =>
                                                setTempDate(date)
                                            }
                                        />

                                        {/* ✅ 날짜 표시 & 추가 버튼 */}
                                        <div className="d-flex justify-content-end gap-1 mt-2">
                                            {/* ✅ 선택한 날짜 표시 */}
                                            <p className="text-center fw-bold m-1">
                                                {tempDate
                                                    ? tempDate.toLocaleDateString()
                                                    : "날짜 선택"}
                                            </p>
                                            <Button
                                                className="add-btn p-2"
                                                size="sm"
                                                onClick={() =>
                                                    handleConfirmDate(
                                                        placeId,
                                                        tempDate
                                                    )
                                                }
                                            >
                                                캘린더에 추가하기
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>

                    {/* 영업 정보 */}
                    <Card className="mt-4">
                        <Card.Body>
                            <p>
                                <strong>시간 : </strong> {place.time}
                            </p>
                            <p>
                                <strong>휴무 : </strong> {place.dayoff}
                            </p>
                            <p>
                                <strong>주차 : </strong> {place.parking}
                            </p>
                            <p>
                                <strong>연락처 : </strong>
                                {place.call}
                            </p>
                        </Card.Body>
                    </Card>

                    {/* 지도 */}
                    <Card className="mt-4">
                        <Card.Body>
                            <p>
                                <strong>주소 : </strong>
                                {place.location}
                            </p>
                            <div
                                id="map"
                                className="position-relative bg-secondary rounded-3"
                                style={{ height: "350px" }}
                            >
                                <Button
                                    variant="outline-light"
                                    className="position-absolute top-2 end-2"
                                >
                                    <MapPin size={20} /> 길찾기
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* 근처 다른 장소 */}
                    <h3 className="mt-4">근처 다른 장소</h3>
                    <Row className="g-3 flex-nowrap overflow-auto">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Col key={i} xs={6} md={3}>
                                <Card>
                                    <div
                                        className="bg-secondary rounded-top"
                                        style={{ height: "150px" }}
                                    ></div>
                                    <Card.Body>
                                        <p className="fw-bold">구현중입니다.</p>
                                        <p className="text-muted">
                                            조금만 기다려 주세요.
                                        </p>
                                        <p className="text-secondary">
                                            - 여기놀자 -
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </Container>
        </>
    );
}

export default Place;
