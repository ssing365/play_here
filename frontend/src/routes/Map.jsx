import TopBar from "../components/TopBar";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Calendar.css";
import { useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import PlaceDetailOffcanvas from "../components/PlaceDetailOffcanvas";
import axios from "axios";

const Map = () => {
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [places, setPlaces] = useState([]);
    const [coupleInfo, setCoupleInfo] = useState(null);

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
                    37.7,
                    128.8
                );
                const options = { center: position, level: 3 };
                new window.kakao.maps.Map(container.current, options);
            }
        }
    }, []);

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
        const formattedDate = selectedDate
            .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
            .replace(/\. /g, "-")
            .replace(".", "");

        // 드래그된 항목이 유효한 곳으로 드롭되지 않았다면, 아무런 동작을 하지 않음
        if (!destination) {
            return;
        }

        // 항목이 동일한 위치로 드래그된 경우
        if (destination.index === source.index) {
            return;
        }

        const response1 = await axios.post(
            "http://localhost:8586/visitList.do",
            { visitDate: formattedDate, coupleId: coupleId }
        );

        const placeIds = [
            ...new Set(response1.data.map((item) => item.placeId)),
        ];

        // 🔹 placeIds 배열 복사
        const updatedPlaceIds = [...placeIds];

        // 🔹 기존 위치에서 아이템 제거
        const [removed] = updatedPlaceIds.splice(source.index, 1);

        // 🔹 새로운 위치에 추가
        updatedPlaceIds.splice(destination.index, 0, removed);

        // 백엔드에 순서 변경된 placeIds 전달
        try {
            const response = await axios.post(
                "http://localhost:8586/updateVisitOrder.do",
                {
                    placeIds: updatedPlaceIds,
                    coupleId: coupleId,
                    visitDate: formattedDate,
                }
            );
            console.log("순서 업데이트 성공:", response.data);
            setPlaces([]);
            visitList(formattedDate);
        } catch (error) {
            console.error("순서 업데이트 실패:", error);
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
                        <div
                            ref={container}
                            style={{ width: "100%", height: "100%" }}
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
                                    <Link to="/calendar" state={{ selectedDate }}>
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
                                                                    <span
                                                                        className="me-2 p-1"
                                                                    >
                                                                        {
                                                                            place.placeName
                                                                        }{" "}
                                                                        {/* ✅ 장소 이름 표시 */}
                                                                    </span>
                                                                )}
                                                                <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleShowDetails(place.placeId)}
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
                                <br />
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
                                    ) : places?.length < 7 ||
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
                                            방문지는 7개까지만 입력 가능합니다
                                            :)
                                        </span>
                                    )
                                ) : (
                                    <span className="text-muted">
                                        방문지는 7개까지만 입력 가능합니다 :)
                                    </span>
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
