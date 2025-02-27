import { useEffect, useState, useContext, useRef } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Heart, Share, MapPin } from "lucide-react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
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
    const [liked, setLiked] = useState(false);
    const [closePlaceList, setClosePlaceList] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { userInfo, isLoggedIn } = useContext(UserContext);
    const userId = userInfo?.userId;
    const coupleId = userInfo?.coupleId;
    const queryParams = new URLSearchParams(location.search);
    const placeId = queryParams.get("id");
    const datepickerRef = useRef(null);
    const defaultImage = "/images/여기놀자.svg"; // 기본 이미지 URL

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [placeId]);

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

    const fetchPlace = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8586/placeView.do?id=${placeId}`
            );
            setPlace(response.data[0]); // 받아온 데이터를 상태에 저장
            closePlace(response.data[0].longitude, response.data[0].latitude);
        } catch (error) {
            console.error("Error fetching place:", error);
        }
    };

    

    // 근처 장소
    const closePlace = async (longitude, latitude) => {
        try {
            const response = await axios.get(
                `http://localhost:8586/closePlace.do`,
                {
                    params: { longitude, latitude, placeId },
                }
            );
            setClosePlaceList(response.data);
        } catch (error) {
            console.error("Error fetching close place:", error);
        }
    };

    // 좋아요 상태 확인
    if (!userInfo?.userId) {
        console.log("userInfo가 아직 로드되지 않음");
        
    }
    if(isLoggedIn){

        axios
        .get(`http://localhost:8586/likeStatus.do`, {
            params: { userId, placeId },
        })
        .then((response) => {
            setLiked(response.data);
        })
        .catch((error) => {
            console.error("Error fetching like status:", error);
        });
    }
    useEffect(() => {
        fetchPlace();
    }, [userInfo, placeId]);

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
                if (!liked) {
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
                } else {
                    // 좋아요가 현재 false이면 좋아요 취소 호출 (interestCancel.do)
                    const response = await axios.post(
                        "http://localhost:8586/placeLike.do",
                        {
                            PlaceId,
                            userId,
                        }
                    );
                    if (response.status === 200) {
                        Swal.fire({
                            title: "좋아요가 취소되었습니다",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    }
                }
                // UI 업데이트: 좋아요 상태 토글
                setLiked(!liked);
            } catch (error) {
                alert("좋아요에 실패했습니다. 잠시후 다시 시도해주세요.");
                console.error("좋아요 요청 중 오류 발생:", error);
            }
        }
        fetchPlace();
    };

    // 캘린더 열기/닫기
    const handleDatePickerToggle = (e) => {
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
        }
        else{
            if (userInfo?.coupleStatus === 0) {
                e.preventDefault(); // 기본 페이지 이동 막기
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
            }
            else{
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
            }
        }
        
    };

    // 캘린더에 일정 추가 submit
    const handleConfirmDate = async (placeId, visitDate) => {
            try {
                const response = await axios.post("http://localhost:8586/addCalendar.do", {
                    placeId,
                    coupleId,
                    visitDate,
                    userId,
                });
                setOpenDatePicker(false); // DatePicker 닫기
                // 성공 알림
                const check = response.data;
                if(check===1){
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
                                }
                                if(check===0){
                                    Swal.fire({
                                        title: "이미 방문리스트에 존재합니다!",
                                        icon: "warning",
                    
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
                                }
                                if(check===6){
                                    Swal.fire({
                                        title: "방문지는 6개까지만 입력 가능합니다!",
                                        icon: "warning",
                    
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
                                }
            } catch (error) {
                console.error("캘린더 추가 요청 중 오류 발생:", error);
                alert("캘린더 추가 중 오류가 발생했습니다."); // 실패 알림
                setOpenDatePicker(false); // 오류 발생 시에도 DatePicker 닫기
            }
        };

    let hashTag = [];
    if (place?.hashtag) {
        for (let j = 0; j < place?.hashtag.length; j++) {
            hashTag.push(<p className="text-secondary">{place?.hashtag[j]}</p>);
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
                        src={
                            place?.image ===
                            "https://via.placeholder.com/300x200?text=No+Place+Image"
                                ? defaultImage
                                : place?.image
                        }
                        alt={place?.placeName || "업체 이미지"}
                        className="w-100 rounded-3 mb-4"
                        style={{
                            height: "500px",
                            objectFit: "cover",
                            width: "100%",
                            opacity:
                                place?.image ===
                                "https://via.placeholder.com/300x200?text=No+Place+Image"
                                    ? 0.6
                                    : 1, // 기본 이미지일 때만 흐리게
                            transition: "opacity 0.3s ease-in-out", // 부드럽게 전환
                        }}
                    />

                    <Row className="g-4">
                        {/* 기본 정보 */}
                        <Col md={6}>
                            <h2 className="fw-bold">
                                {place?.placeName ||
                                    "업체에서 제공한 정보가 없습니다."}
                            </h2>
                            <p className="text-muted">
                                {place?.location_short}
                            </p>
                            <div className="hashtags">
                                {hashTag.map((tag, index) => (
                                    <span key={index} className="hashtag">
                                        {tag.props.children}
                                    </span>
                                ))}
                            </div>
                        </Col>
                        <Col md={6} className="text-end">
                            <Button
                                variant="outline-secondary"
                                className="me-2"
                            >
                                <Share size={20} />
                            </Button>
                            {liked ? (
                                <Button
                                    variant="danger"
                                    className="sm me-2"
                                    onClick={(e) => handleLikeClick(placeId, e)}
                                >
                                    ❤{" "}
                                    {place?.likes ||
                                        "업체에서 제공한 정보가 없습니다."}
                                </Button>
                            ) : (
                                <Button
                                    variant="outline-danger"
                                    className="sm me-2"
                                    onClick={(e) => handleLikeClick(placeId, e)}
                                >
                                    ❤{" "}
                                    {place?.likes ||
                                        "업체에서 제공한 정보가 없습니다."}
                                </Button>
                            )}

                            {/* 캘린더 버튼 */}
                            <div className="calendar-container position-relative d-inline-block">
                                <Button
                                    variant="success"
                                    onClick={handleDatePickerToggle}
                                >
                                    📅 캘린더에 일정 추가하기
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

                                        {/* 날짜 표시 & 추가 버튼 */}
                                        <div className="d-flex justify-content-end gap-1 mt-2">
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
                                <strong>시간 : </strong>
                                {place?.time ||
                                    "업체에서 제공한 정보가 없습니다."}
                            </p>
                            <p>
                                <strong>휴무 : </strong>
                                {place?.dayoff ||
                                    "업체에서 제공한 정보가 없습니다."}
                            </p>
                            <p>
                                <strong>주차 : </strong>
                                {place?.parking ||
                                    "업체에서 제공한 정보가 없습니다."}
                            </p>
                            <p>
                                <strong>연락처 : </strong>
                                {place?.call ||
                                    "업체에서 제공한 정보가 없습니다."}
                            </p>
                        </Card.Body>
                    </Card>

                    {/* 지도 */}
                    <Card className="mt-4">
                        <Card.Body>
                            <p>
                                <strong>주소 : </strong>
                                {place?.location ||
                                    "업체에서 제공한 정보가 없습니다."}{" "}
                                {place?.link && (
                                    <Link to={place.link} target="_blank">
                                        카카오맵 바로가기
                                    </Link>
                                )}
                            </p>

                            {(!isNaN(Number(place?.latitude)) &&
  !isNaN(Number(place?.longitude)) &&
  Number(place?.latitude) !== 0 &&
  Number(place?.longitude) !== 0) ? (
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
    {/* 지도 렌더링 컴포넌트 또는 로직 */}
  </div>
) : (
  <div
    className="d-flex align-items-center justify-content-center bg-secondary rounded-3"
    style={{ height: "350px" }}
  >
    <p className="text-white m-0">
      업체에서 제공한 위치 정보가 없습니다.
    </p>
  </div>
)}

                        </Card.Body>
                    </Card>

                    {/* 근처 다른 장소 */}
                    {place?.latitude == null || place?.longitude == null ? (
                        <></>
                    ) : (
                        <>
                            <h3 className="mt-4">근처 다른 장소</h3>
                            <Row className="g-3 flex-nowrap overflow-auto">
                                {closePlaceList.map((place, index) => (
                                    <Col key={index} xs={6} md={3}>
                                        <Card>
                                            <div
                                                className="bg-secondary rounded-top"
                                                style={{
                                                    height: "150px",
                                                    backgroundImage: `url(${
                                                        place?.image &&
                                                        place.image !==
                                                            "https://via.placeholder.com/300x200?text=No+Place+Image"
                                                            ? place.image
                                                            : defaultImage
                                                    })`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition:
                                                        "center",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                    (window.location.href = `/place?id=${place.placeId}`)
                                                }
                                            ></div>
                                            <Card.Body>
                                                <p
                                                    className="fw-bold"
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {place.placeName}
                                                </p>
                                                <p className="text-muted">
                                                    {place.location_short}
                                                </p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </>
                    )}
                </Container>
            </Container>
        </>
    );
}

export default Place;