import TopBar from "../components/TopBar";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Calendar.css";
import { useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import PlaceDetailOffcanvas from "../components/PlaceDetailOffcanvas";
import axios from "axios";

const { kakao } = window;

const Map = () => {
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [places, setPlaces] = useState([]);
    const [coupleInfo, setCoupleInfo] = useState(null);
    const [totalDistance, setTotalDistance] = useState(0);
    const [walkingTimeFormatted, setWalkingTimeFormatted] = useState("");
    const [drivingTimeFormatted, setDrivingTimeFormatted] = useState("");

    const location = useLocation();

    // context에서 로그인 상태, 유저 정보 가져오기
    const { userInfo } = useContext(UserContext);
    const userId = userInfo?.userId;
    const coupleId = userInfo?.coupleId;

    // 다른 페이지에서 전달된 날짜를 읽어와 상태 업데이트
    useEffect(() => {
        if (location.state && location.state.selectedDate) {
            setSelectedDate(new Date(location.state.selectedDate));
        }
    }, [location]);

    //장소 자동완성
    const [newPlace, setNewPlace] = useState("");
    const [placeList, setPlaceList] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false); // API에서 장소 목록 가져오기
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8586/SearchPlace.do"
                );
                console.log("Fetched places:", response.data);
                // API 응답이 배열이라고 가정
                setPlaceList(response.data);
            } catch (error) {
                console.error("Error fetching places:", error);
            }
        };
        fetchPlaces();
    }, []);

    // 입력값(newPlace)이 바뀔 때마다 필터링
    useEffect(() => {
        if (newPlace.trim() === "") {
            setFilteredPlaces([]);
            setShowDropdown(false);
        } else {
            const filtered = placeList.filter((place) =>
                place.placeName.toLowerCase().includes(newPlace.toLowerCase())
            );
            setFilteredPlaces(filtered);
            setShowDropdown(filtered.length > 0);
        }
    }, [newPlace, placeList]);

    // 외부 클릭 시 dropdown 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);

    // 입력창 표시 여부 (버튼 클릭 시 토글)
    const [showInput, setShowInput] = useState(false);

    // refs
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // offcanvas 및 상세정보 관련 상태
    const [placeDetail, setPlaceDetail] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const handleClose = () => setShowOffcanvas(false);

    // 장소 정보 가져오기 함수 수정 (id 파라미터 추가)
    const fetchPlace = async (id) => {
        try {
            const response = await axios.get(
                `http://localhost:8586/placeView.do?id=${id}`
            );
            console.log(response.data);
            setPlaceDetail(response.data[0]); // 받아온 데이터를 상태에 저장
        } catch (error) {
            console.error("Error fetching place:", error);
        }
    };

    // 상세보기 버튼 클릭 시 실행할 함수
    const handleShowDetails = async (id) => {
        await fetchPlace(id);
        setShowOffcanvas(true);
    };

    const container = useRef(null);

    // useEffect(() => {
    //     // ✅ Kakao Maps API가 아직 로드되지 않았으면 동적으로 추가
    //     if (!window.kakao || !window.kakao.maps) {
    //         const script = document.createElement("script");
    //         script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=9b5ba96e8bd64e3f89af591fdaa2a20d&autoload=false`;
    //         script.async = true;
    //         document.head.appendChild(script);

    //         script.onload = () => {
    //             console.log("✅ Kakao Maps API 로드 완료");
    //             window.kakao.maps.load(() => {
    //                 createMap();
    //             });
    //         };
    //     } else {
    //         createMap();
    //     }

    //     function createMap() {
    //         if (container.current && window.kakao) {
    //             const position = new window.kakao.maps.LatLng(
    //                 dummy.latitude,
    //                 dummy.longitude
    //             );
    //             const options = { center: position, level: 3 };
    //             new window.kakao.maps.Map(container.current, options);
    //         }
    //     }
    // }, []);

    // 헬퍼 함수: 두 좌표 간 거리를 (km) 계산 (Haversine 공식)
    function getDistance(point1, point2) {
        const lat1 = point1.getLat();
        const lon1 = point1.getLng();
        const lat2 = point2.getLat();
        const lon2 = point2.getLng();
        const R = 6371; // 지구 반지름 (km)
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        console.log(distance);
        return distance;
    }
    useEffect(() => {
        let centerLat, centerLng;
        const container = document.getElementById("map");
        if (!container) return;

        let map, options;
        // 유효한 위도/경도 값을 가진 장소만 필터링
        const validPlaces = places.filter(
            (place) => place.latitude && place.longitude
        );

        // 방문지가 없거나 유효한 장소가 없으면 기본 서울 좌표 사용
        if (places.length === 0) {
            centerLat = 37.5665;
            centerLng = 126.978;
            options = {
                center: new window.kakao.maps.LatLng(centerLat, centerLng),
                level: 7,
            };
            map = new window.kakao.maps.Map(container, options);
        } else if (validPlaces.length === 1) {
            // 방문지가 하나인 경우
            centerLat = validPlaces[0].latitude;
            centerLng = validPlaces[0].longitude;
            options = {
                center: new window.kakao.maps.LatLng(centerLat, centerLng),
                level: 5,
            };
            map = new window.kakao.maps.Map(container, options);
        } else {
            // 방문지가 2개 이상인 경우 bounds로 중심 좌표 및 줌 레벨 자동 조절
            const bounds = new window.kakao.maps.LatLngBounds();
            validPlaces.forEach((place) => {
                bounds.extend(
                    new window.kakao.maps.LatLng(
                        place.latitude,
                        place.longitude
                    )
                );
            });
            options = {
                center: new window.kakao.maps.LatLng(37.5, 126.9),
                level: 7, // 초기 줌 레벨 (setBounds 호출 후 자동 조절)
            };
            map = new window.kakao.maps.Map(container, options);
            map.setBounds(bounds);
        }

        // 마커 추가와 동시에 폴리라인 경로 배열 생성
        const polylinePath = [];
        places.forEach((place, index) => {
            if (!place.latitude || !place.longitude) return;

            const latLng = new window.kakao.maps.LatLng(
                place.latitude,
                place.longitude
            );
            polylinePath.push(latLng);

            const imageSrc = `../../images/marker(${index + 1}).svg`;
            const imageSize = new window.kakao.maps.Size(64, 69);
            const imageOption = { offset: new window.kakao.maps.Point(27, 69) };
            const markerImage = new window.kakao.maps.MarkerImage(
                imageSrc,
                imageSize,
                imageOption
            );
            const marker = new window.kakao.maps.Marker({
                position: latLng,
                image: markerImage,
            });
            marker.setMap(map);
            // 마커 클릭 시, 상세보기 버튼을 누른 것과 동일하게 offcanvas가 뜨도록 처리
            window.kakao.maps.event.addListener(marker, "click", function () {
                handleShowDetails(place.placeId);
            });
        });

        // 마커 순서대로 선(폴리라인) 그리기
        if (polylinePath.length >= 2) {
            const polyline = new window.kakao.maps.Polyline({
                path: polylinePath,
                strokeWeight: 3,
                strokeColor: "#e91e63",
                strokeOpacity: 0.7,
                strokeStyle: "solid",
            });
            polyline.setMap(map);

            // 폴리라인 길이(총 거리) 계산
            let totalDistance = 0;
            for (let i = 0; i < polylinePath.length - 1; i++) {
                totalDistance += getDistance(
                    polylinePath[i],
                    polylinePath[i + 1]
                );
            }
            setTotalDistance(totalDistance.toFixed(2));

            // 도보 소요시간 (평균 5km/h): 분 단위 계산
            const walkingMinutes = (totalDistance / 5) * 60;
            const walkingMinutesInt = Math.round(walkingMinutes);
            const walkingHours = Math.floor(walkingMinutesInt / 60);
            const walkingRemain = walkingMinutesInt % 60;
            setWalkingTimeFormatted(
                `${
                    walkingHours > 0 ? walkingHours + "시간 " : ""
                }${walkingRemain}분`
            );

            // 차량 소요시간 (평균 50km/h): 분 단위 계산
            const drivingMinutes = (totalDistance / 50) * 60;
            const drivingMinutesInt = Math.round(drivingMinutes);
            const drivingHours = Math.floor(drivingMinutesInt / 60);
            const drivingRemain = drivingMinutesInt % 60;
            setDrivingTimeFormatted(
                `${
                    drivingHours > 0 ? drivingHours + "시간 " : ""
                }${drivingRemain}분`
            );
        }
    }, [places]);

    useEffect(() => {
        const coupleInfo = async () => {
            if (coupleId) {
                try {
                    const response = await axios.post(
                        "http://localhost:8586/coupleInfo.do",
                        { coupleId, userId }
                    );
                    if (response.data.length > 0) {
                        setCoupleInfo(response.data[0]);
                    } else {
                        setCoupleInfo({ nickname: "Unknown" }); // 기본값 설정
                    }
                } catch (error) {
                    console.error("Error coupleInfo:", error);
                }
            }
        };
        coupleInfo();
    }, []); // coupleId 변경 시 실행

    useEffect(() => {
        const formattedDate = selectedDate
            .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
            .replace(/\. /g, "-")
            .replace(".", "");
        setPlaces([]);
        visitList(formattedDate);
    }, [selectedDate, coupleInfo]);

    /* 방문지 리스트 출력 */
    const visitList = async (formattedDate) => {
        try {
            const response1 = await axios.post(
                "http://localhost:8586/visitList.do",
                { visitDate: formattedDate, coupleId: coupleId }
            );
            console.log(response1.data);
            setPlaces(response1.data); // 상태 업데이트
        } catch (error) {
            console.error("Error visit list :", error);
        }
    };

    /* 방문지 리스트 드래그 */
    const onDragEnd = async (result) => {
        const { destination, source } = result;
        if (!destination || destination.index === source.index) return;
      
        // 기존 places 배열을 복사하여 순서 변경 (낙관적 업데이트)
        const updatedPlaces = Array.from(places);
        const [removed] = updatedPlaces.splice(source.index, 1);
        updatedPlaces.splice(destination.index, 0, removed);
      
        // UI에 바로 업데이트
        setPlaces(updatedPlaces);
      
        // 업데이트된 순서에 따른 placeIds 배열 생성
        const updatedPlaceIds = updatedPlaces.map((p) => p.placeId);
        const formattedDate = selectedDate
          .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
          .replace(/\. /g, "-")
          .replace(".", "");
      
        try {
          // 백엔드에 순서 변경된 placeIds 전송
          await axios.post("http://localhost:8586/updateVisitOrder.do", {
            placeIds: updatedPlaceIds,
            coupleId: coupleId,
            visitDate: formattedDate,
          });
          // 서버에서 새로운 데이터를 받아오더라도 UI에서 깜빡이지 않도록 상태를 덮어씌움
          const response = await axios.post("http://localhost:8586/visitList.do", {
            visitDate: formattedDate,
            coupleId: coupleId,
          });
          setPlaces(response.data);
        } catch (error) {
          console.error("순서 업데이트 실패:", error);
          // 실패 시 원래 상태로 복구하거나, 에러 처리를 할 수 있음
        }
      };

    // API에서 장소 목록 가져오기
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8586/SearchPlace.do"
                );
                console.log("Fetched places:", response.data);
                // API 응답이 배열이라고 가정
                setPlaceList(response.data);
            } catch (error) {
                console.error("Error fetching places:", error);
            }
        };
        fetchPlaces();
    }, []);

    // 입력값(newPlace)이 바뀔 때마다 필터링
    useEffect(() => {
        if (newPlace.trim() === "") {
            setFilteredPlaces([]);
            setShowDropdown(false);
        } else {
            const filtered = placeList.filter((place) =>
                place.placeName.toLowerCase().includes(newPlace.toLowerCase())
            );
            setFilteredPlaces(filtered);
            setShowDropdown(filtered.length > 0);
        }
    }, [newPlace, placeList]);

    // 외부 클릭 시 dropdown 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 입력창 변경 이벤트
    const handleInputChange = (e) => {
        setNewPlace(e.target.value);
        setSelectedPlaceId(null);
    };

    // Enter 키 입력 처리
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            if (selectedPlaceId) {
                addPlace({ placeId: selectedPlaceId, placeName: newPlace });
            } else {
                const matchedPlace = placeList.find(
                    (place) =>
                        place.placeName.toLowerCase() === newPlace.toLowerCase()
                );
                if (matchedPlace) {
                    setSelectedPlaceId(matchedPlace.placeId);
                    addPlace({
                        placeId: matchedPlace.placeId,
                        placeName: matchedPlace.placeName,
                    });
                } else {
                    console.log("일치하는 장소가 없습니다.");
                }
            }
            setShowDropdown(false);
        }
    };

    // 드롭다운 항목 클릭 처리
    const handleSelectPlace = (place) => {
        setNewPlace(place.placeName);
        setSelectedPlaceId(place.placeId);
        setShowDropdown(false);
        addPlace({ placeId: place.placeId, placeName: place.placeName });
    };

    // 장소 추가 함수
    const addPlace = async (placeObj) => {
        const formattedDate = selectedDate
            .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
            .replace(/\. /g, "-")
            .replace(".", "");
        console.log("추가할 장소:", placeObj);

        await axios.post("http://localhost:8586/addCalendar.do", {
            placeId: placeObj.placeId,
            coupleId,
            visitDate: formattedDate,
        });
        visitList(formattedDate);
        // 추가 후 입력값 초기화
        setNewPlace("");
        // 포커스 처리 (ref null 체크)
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    /* 방문지 삭제 */
    const deletePlace = async (placeId) => {
        console.log(placeId);
        const formattedDate = selectedDate
            .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
            .replace(/\. /g, "-")
            .replace(".", "");
        try {
            await axios.post("http://localhost:8586/visitDelete.do", {
                visitDate: formattedDate,
                coupleId: coupleId,
                placeId: placeId,
            });
            visitList(formattedDate);
        } catch (error) {
            console.error("삭제 요청 중 오류 발생:", error);
        }
    };

    /* 방문지 수정 */
    const editPlace = (placeId, newName) => {
        const updatedPlaces = places[selectedDate].map((place) =>
            place.id === placeId ? { ...place, name: newName } : place
        );
        setPlaces({ ...places, [selectedDate]: updatedPlaces });
    };

    // 수정 입력창 관리
    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState("");

    return (
        <>
            {/** OFFCANVAS */}
            <PlaceDetailOffcanvas
                show={showOffcanvas}
                handleClose={handleClose}
                place={placeDetail}
            />
            {/** OFFCANVAS */}

            <TopBar />
            <Container fluid className="back-container vh-100">
                <Row className="couple-calendar-container">
                    <Col
                        md={6}
                        className="calendar-column d-flex flex-column justify-content-between"
                    >
                        {/* <div
                            ref={container}
                            style={{ width: "100%", height: "100%" }}
                        ></div> */}
                        <div
                            id="map"
                            className="position-relative bg-secondary rounded-3"
                            style={{ width: "100%", height: "90%"}}
                        ></div>
                    </Col>
                    <Col md={6} className="places-column">
                        {selectedDate && (
                            <>
                                <h4 className="today-date-title">
                                    {selectedDate.getMonth() + 1}월{" "}
                                    {selectedDate.getDate()}일
                                </h4>
                                <div className="d-flex align-items-center mb-3">
                                    <b>방문지 리스트</b>
                                    <Link
                                        to="/calendar"
                                        state={{ selectedDate }}
                                    >
                                        <Button
                                            variant="outline-success"
                                            className="ms-3 border-0"
                                        >
                                            캘린더 보기 📅
                                        </Button>
                                    </Link>
                                </div>

                                {/* 장소 리스트 렌더링 */}
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="placesList">
                                        {(provided) => (
                                            <ul
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="list-unstyled"
                                            >
                                                {places?.map((place, i) => (
                                                    <Draggable
                                                        key={place.placeId}
                                                        draggableId={String(
                                                            place.placeId
                                                        )}
                                                        index={i}
                                                    >
                                                        {(provided) => (
                                                            <li
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                className="list-group-item d-flex align-items-center"
                                                            >
                                                                <span
                                                                    {...provided.dragHandleProps}
                                                                    className="me-2 p-1"
                                                                    style={{
                                                                        cursor: "grab",
                                                                    }}
                                                                >
                                                                    ☰ {i + 1}.
                                                                </span>
                                                                {editId ===
                                                                place.placeId ? (
                                                                    <input
                                                                        type="text"
                                                                        value={
                                                                            editText
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setEditText(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        onBlur={() => {
                                                                            editPlace(
                                                                                place.placeId,
                                                                                editText
                                                                            );
                                                                            setEditId(
                                                                                null
                                                                            );
                                                                        }}
                                                                        onKeyPress={(
                                                                            e
                                                                        ) => {
                                                                            if (
                                                                                e.key ===
                                                                                "Enter"
                                                                            ) {
                                                                                editPlace(
                                                                                    place.placeId,
                                                                                    editText
                                                                                );
                                                                                setEditId(
                                                                                    null
                                                                                );
                                                                            }
                                                                        }}
                                                                        autoFocus
                                                                    />
                                                                ) : (
                                                                    <span className="me-2 p-1">
                                                                        {
                                                                            place.placeName
                                                                        }{" "}
                                                                        {/* ✅ 장소 이름 표시 */}
                                                                    </span>
                                                                )}
                                                                <Button
                                                                    variant="outline-secondary"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleShowDetails(
                                                                            place.placeId
                                                                        )
                                                                    }
                                                                    className="me-2"
                                                                >
                                                                    상세보기
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    className="ms-auto"
                                                                    onClick={() =>
                                                                        deletePlace(
                                                                            place.placeId
                                                                        )
                                                                    }
                                                                >
                                                                    ✕
                                                                </Button>
                                                            </li>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </ul>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                                {/* 장소 추가 버튼 (장소가 7개 미만일 때만 표시) */}
                                {places?.length < 7 ? (
                                    showInput ? (
                                        <div className="mt-2 d-flex align-items-center">
                                            {/* 자동완성 input + dropdown */}
                                            <div
                                                style={{
                                                    position: "relative",
                                                    display: "inline-block",
                                                }}
                                                ref={containerRef}
                                            >
                                                <input
                                                    ref={inputRef}
                                                    type="text"
                                                    value={newPlace}
                                                    onChange={handleInputChange}
                                                    placeholder="장소 입력"
                                                    className="form-control w-auto me-2"
                                                    onKeyPress={handleKeyPress}
                                                />
                                                {showDropdown &&
                                                    filteredPlaces.length >
                                                        0 && (
                                                        <ul
                                                            className="dropdown-menu show"
                                                            style={{
                                                                position:
                                                                    "absolute",
                                                                top: "100%",
                                                                left: 0,
                                                                width: "100%",
                                                                maxHeight:
                                                                    "350px",
                                                                overflow:
                                                                    "auto",
                                                                zIndex: 1000,
                                                                border: "1px solid #ccc",
                                                                backgroundColor:
                                                                    "#fff",
                                                            }}
                                                        >
                                                            {filteredPlaces.map(
                                                                (
                                                                    place,
                                                                    index
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <button
                                                                            type="button"
                                                                            className="dropdown-item"
                                                                            onClick={() =>
                                                                                handleSelectPlace(
                                                                                    place
                                                                                )
                                                                            }
                                                                        >
                                                                            {
                                                                                place.placeName
                                                                            }
                                                                        </button>
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    )}
                                            </div>
                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={() =>
                                                    setShowInput(false)
                                                }
                                            >
                                                취소
                                            </button>
                                        </div>
                                    ) : places?.length < 6 ||
                                      places?.length === undefined ? (
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setShowInput(true);
                                            }}
                                        >
                                            + 방문지를 추가하세요 :)
                                        </a>
                                    ) : (
                                        <span className="text-muted">
                                            방문지는 6개까지만 입력 가능합니다
                                            :)
                                        </span>
                                    )
                                ) : (
                                    <span className="text-muted">
                                        방문지는 6개까지만 입력 가능합니다 :)
                                    </span>
                                )}
                                <hr />
                                <br />
                                {places.length > 1 ? (
                                    <>
                                        <h6>
                                            📏 총 직선 거리 : {totalDistance}km
                                        </h6>
                                        <br />
                                        <h6>
                                            이동 예상 시간{" "}
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={
                                                    <Tooltip id="tooltip-info">
                                                        도로상황을 고려하지 않은
                                                        예상 시간으로,
                                                        직선거리를 평균
                                                        속도(도보:5km/h,
                                                        차량:50km/h)로 나누어
                                                        계산한 정보임을
                                                        참고하시기 바랍니다.
                                                    </Tooltip>
                                                }
                                            >
                                                <span
                                                    style={{
                                                        color: "gray",
                                                        cursor: "pointer",
                                                        fontSize: "0.9em",
                                                    }}
                                                >
                                                    ⓘ
                                                </span>
                                            </OverlayTrigger>{" "}
                                        </h6>
                                        <h6>
                                            🚶‍♂️🚶‍♀️ 도보: {walkingTimeFormatted}{" "}
                                        </h6>
                                        <h6>
                                            🚗 차량: {drivingTimeFormatted}{" "}
                                        </h6>
                                    </>
                                ) : (
                                    ""
                                )}
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Map;
