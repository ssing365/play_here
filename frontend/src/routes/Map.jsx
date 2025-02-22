import TopBar from "../components/TopBar";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Calendar.css";
import { useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { v4 as uuidv4 } from "uuid"; // 드래그를 위한 고유한 ID 생성
import PlaceDetailOffcanvas from "../components/PlaceDetailOffcanvas";

const Map = () => {
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(Date);
    const [newPlace, setNewPlace] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [places, setPlaces] = useState({});
    const today = new Date();
    // context에서 로그인 상태, 유저 정보 가져오기
    const { userInfo } = useContext(UserContext);

    /** OFFCANAS 호출 -- 시작 */
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState({});
    // offcanvas 더미
    const dummy = {
        call: "064-757-0976",
        descript: null,
        editDate: "2025-02-19 00:00:00",
        hashtag: ["#벚꽃명소"],
        image: "https://t1.kakaocdn.net/thumb/T800x0.q50/?fname=http%3A%2F%2Ft1.kakaocdn.net%2Ffiy_reboot%2Fplace%2FE7A1430F241948CFA7589DA36133F881",
        latitude: "33.511103",
        likeStatus: null,
        likes: "5",
        link: "https://place.map.kakao.com/9937633",
        location: "제주특별자치도 제주시 서문로 43  (우)63153",
        location_short: "제주특별자치도 제주시",
        longitude: "126.515612",
        mainCate: null,
        parking: "정보 없음",
        placeId: "7442",
        placeName: "제주향교",
        placenameOnmap: "제주향교",
        registDate: "2025-02-19 00:00:00",
        time: null,
    };

    const handleShow = (dummy) => {
        setSelectedPlace(dummy);
        setShowOffcanvas(true);
    };

    const handleClose = () => setShowOffcanvas(false);

    /** OFFCANAS 호출 -- 끝 */

    useEffect(() => {
        setSelectedDate(today.getDate());
    }, []);
    const container = useRef(null);

    useEffect(() => {
        // ✅ Kakao Maps API가 아직 로드되지 않았으면 동적으로 추가
        if (!window.kakao || !window.kakao.maps) {
            const script = document.createElement("script");
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=9b5ba96e8bd64e3f89af591fdaa2a20d&autoload=false`;
            script.async = true;
            document.head.appendChild(script);

            script.onload = () => {
                console.log("✅ Kakao Maps API 로드 완료");
                window.kakao.maps.load(() => {
                    createMap();
                });
            };
        } else {
            createMap();
        }

        function createMap() {
            if (container.current && window.kakao) {
                const position = new window.kakao.maps.LatLng(
                    dummy.latitude,
                    dummy.longitude
                );
                const options = { center: position, level: 3 };
                new window.kakao.maps.Map(container.current, options);
            }
        }
    }, []);

    /* 방문지 리스트 드래그 */
    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(places[selectedDate] || []);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setPlaces({ ...places, [selectedDate]: items });
    };

    /* 방문지 추가 */
    const addPlace = () => {
        // 최대 7개
        if (newPlace.trim() && (places[selectedDate]?.length || 0) < 7) {
            const newPlaceObj = { id: uuidv4().toString(), name: newPlace };
            setPlaces({
                ...places,
                [selectedDate]: [...(places[selectedDate] || []), newPlaceObj],
            });
            setNewPlace("");
            setShowInput(false);
        }
    };

    /* 방문지 삭제 */
    const deletePlace = (placeId) => {
        const updatedPlaces = places[selectedDate]?.filter(
            (place) => place.id !== placeId
        ); // 선택된 날짜에서 해당 placeId 제거

        setPlaces({
            ...places,
            [selectedDate]: updatedPlaces, // 선택된 날짜의 places만 업데이트
        });
    };

    return (
        <>
            {/** OFFCANVAS */}
            <PlaceDetailOffcanvas
                show={showOffcanvas}
                handleClose={handleClose}
                place={selectedPlace}
            />
            {/** OFFCANVAS */}

            <TopBar />
            <Container fluid className="back-container vh-100">
                <Row className="couple-calendar-container">
                    <Col
                        md={6}
                        className="calendar-column d-flex flex-column justify-content-between"
                    >
                        <div
                            ref={container}
                            style={{ width: "100%", height: "100%" }}
                        ></div>
                    </Col>
                    <Col md={6} className="places-column">
                        {selectedDate && (
                            <>
                                <h4 className="today-date-title">
                                    {date.getMonth() + 1}월 {selectedDate}일
                                </h4>
                                <div className="d-flex align-items-center mb-3">
                                    <b>방문지 리스트</b>
                                    <Link to="/calendar">
                                        <Button
                                            variant="outline-success"
                                            className="ms-3 border-0"
                                        >
                                            캘린더 보기 📅
                                        </Button>
                                    </Link>
                                </div>

                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="placesList">
                                        {(provided) => (
                                            <ul
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="list-unstyled"
                                            >
                                                {places[selectedDate]?.map(
                                                    (place, i) => (
                                                        <Draggable
                                                            key={place.id}
                                                            draggableId={String(
                                                                place.id
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
                                                                        ☰{" "}
                                                                        {i + 1}.{" "}
                                                                        {
                                                                            place.name
                                                                        }
                                                                    </span>
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        className="ms-auto"
                                                                        onClick={() =>
                                                                            deletePlace(
                                                                                place.id
                                                                            )
                                                                        } // X 버튼 클릭 시 삭제
                                                                    >
                                                                        ✕
                                                                    </Button>
                                                                </li>
                                                            )}
                                                        </Draggable>
                                                    )
                                                )}
                                                {provided.placeholder}
                                            </ul>
                                        )}
                                    </Droppable>
                                </DragDropContext>

                                <Button onClick={() => handleShow(dummy)}>
                                    상세 보기
                                </Button>
                                <br />
                                {showInput ? (
                                    <div className="mt-2 d-flex align-items-center">
                                        <input
                                            type="text"
                                            value={newPlace}
                                            onChange={(e) =>
                                                setNewPlace(e.target.value)
                                            }
                                            placeholder="장소 입력"
                                            className="form-control w-auto me-2"
                                            onKeyPress={(e) =>
                                                e.key === "Enter" && addPlace()
                                            } // 엔터키 입력
                                        />
                                        <Button
                                            onClick={addPlace}
                                            className="add-btn"
                                        >
                                            추가
                                        </Button>
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowInput(false)}
                                        >
                                            취소
                                        </button>
                                    </div>
                                ) : (
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowInput(true);
                                        }}
                                    >
                                        + 방문지를 추가하세요 :)
                                    </a>
                                )}
                                <hr />
                                <br />
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Map;
