import { useState, useContext, useEffect, useRef } from "react";
import TopBar from "../components/TopBar";
import Diary from "../components/Calendar/Diary";
import Cal from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/Calendar.css";
import { FaSearch } from "react-icons/fa";
import {
    Button,
    Form,
    Row,
    Col,
    Card,
    Container,
} from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";

const Calendar = () => {
    const [date, setDate] = useState(new Date());
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [places, setPlaces] = useState([]);
    const [diaryEntry, setDiaryEntry] = useState("");
    const [editDiary, setEditDiary] = useState(false);
    const [diaryText, setDiaryText] = useState(diaryEntry || "");
    const [yourDiaryText, setYourDiaryText] = useState(diaryEntry || "");
    const [coupleInfo, setCoupleInfo] = useState(null);
    const [noDiary, setNoDiary] = useState(false);
    const today = new Date();
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
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);

    // 입력창 표시 여부 (버튼 클릭 시 토글)
    const [showInput, setShowInput] = useState(false);

    // refs
    const containerRef = useRef(null);
    const inputRef = useRef(null);

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
        if (coupleInfo) {
            diary(formattedDate);
        }
    }, [selectedDate, coupleInfo]);

    // 일기 가져오기
    const diary = async (formattedDate) => {
        if (coupleId) {
            const response1 = await axios.post(
                "http://localhost:8586/Diary.do",
                {
                    coupleId: coupleId,
                    diaryWriter: userId,
                    diaryDate: formattedDate,
                }
            );
            if (response1.data.length > 0) {
                setNoDiary(false);
                setDiaryText(response1.data[0].content);
            } else {
                setDiaryText("");
                setNoDiary(true);
            }
            const response2 = await axios.post(
                "http://localhost:8586/Diary.do",
                {
                    coupleId: coupleId,
                    diaryWriter: coupleInfo.userId,
                    diaryDate: formattedDate,
                }
            );
            if (response2.data.length > 0) {
                setYourDiaryText(response2.data[0].content);
            } else {
                setYourDiaryText("");
            }
        }
    };

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

    /* 방문지 추가 */
    // const placeInput = document.getElementById("placeInput");
    // const addPlace = () => {
    //     // 최대 7개
    //     if (newPlace.trim() && (places[selectedDate]?.length || 0) < 7) {
    //         const newPlaceObj = { id: uuidv4().toString(), name: newPlace };
    //         setPlaces({
    //             ...places,
    //             [selectedDate]: [...(places[selectedDate] || []), newPlaceObj],
    //         });
    //         setNewPlace("");
    //         setShowInput(false);
    //         placeInput.focus();
    //     }
    // };

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

    /* 일기, 방문지 추가시 달력에 점 표시 */
    const tileContent = ({ date }) => {
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        if (places[day] && month === currentMonth && year === currentYear) {
            return <span className="calendar-dot"></span>;
        }
        return null;
    };

    /** 일기 저장 */
    const saveDiary = async () => {
        if (diaryText.trim()) {
            setDiaryEntry(diaryText);
        } else {
            setDiaryEntry("일기를 남겨주세요");
        }
        setEditDiary(false);
        const formattedDate = date
            .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
            .replace(/\. /g, "-")
            .replace(".", "");

        if (noDiary) {
            await axios.post("http://localhost:8586/NewDiary.do", {
                coupleId: coupleId,
                diaryWriter: userId,
                diaryDate: formattedDate,
                content: diaryText,
            });
            setNoDiary(false);
        } else {
            if (coupleId) {
                await axios.post("http://localhost:8586/DiaryEdit.do", {
                    coupleId: coupleId,
                    diaryWriter: userId,
                    diaryDate: formattedDate,
                    content: diaryText,
                });
            }
        }
        diary(formattedDate);
    };

    return (
        <>
            <TopBar />
            <Container fluid className="back-container vh-100">
                <Row className="couple-calendar-container">
                    {/* 왼쪽 커플 캘린더 */}
                    <Col
                        md={6}
                        className="calendar-column d-flex flex-column justify-content-between"
                    >
                        <h4 className="mb-3">
                            {userInfo ? userInfo.nickname : "Loading..."} ❤{" "}
                            {coupleInfo ? coupleInfo.nickname : "Loading..."}
                        </h4>

                        {/* 검색창과 돋보기 아이콘을 함께 묶은 박스 */}
                        <div className="search-container d-flex align-items-center justify-content-end mb-3">
                            <Form.Control
                                type="text"
                                placeholder="데이트 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="calendar__search-input me-2"
                            />
                            <FaSearch
                                className="search-icon"
                                onClick={() => setShowSearch(!showSearch)}
                            />
                        </div>

                        <Cal
                            onChange={setDate}
                            value={selectedDate}
                            onClickDay={(value) => {
                                setSelectedDate(value)
                            }}
                            className="couple-calendar flex-grow-1"
                            tileContent={tileContent}
                        />
                    </Col>

                    {/* 오른쪽 방문지 리스트 */}
                    <Col md={6} className="places-column">
                        {userInfo ? (
                            userInfo.coupleStatus === 0 ? (
                                <div className="muted-overlay">
                                    <div className="muted-message text-center">
                                        <h6>
                                            캘린더를 이용하려면 커플 연결을
                                            해야합니다 :(
                                        </h6>
                                        <Link to="/connect-couple">
                                            <button className="mt-3 couple-btn">
                                                커플 연동하기
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                selectedDate && (
                                    <>
                                        <h4 className="today-date-title">
                                            {selectedDate.getMonth() + 1}월{" "}
                                            {selectedDate.getDate()}일
                                        </h4>
                                        <div className="d-flex align-items-center mb-3">
                                            <b>방문지 리스트</b>
                                            <Link
                                                to="/map"
                                                state={{
                                                    selectedDate: selectedDate,
                                                }}
                                            >
                                                <Button
                                                    variant="outline-success"
                                                    className="ms-3 border-0"
                                                >
                                                    지도 보기 🗺️
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
                                                        {places?.map(
                                                            (place, i) => (
                                                                <Draggable
                                                                    key={
                                                                        place.placeId
                                                                    }
                                                                    draggableId={String(
                                                                        place.placeId
                                                                    )}
                                                                    index={i}
                                                                >
                                                                    {(
                                                                        provided
                                                                    ) => (
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
                                                                                {i +
                                                                                    1}

                                                                                .
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
                                                                                    onClick={() => {
                                                                                        setEditId(
                                                                                            place.placeId
                                                                                        );
                                                                                        setEditText(
                                                                                            place.placeName
                                                                                        );
                                                                                    }}
                                                                                    className="me-2 p-1"
                                                                                >
                                                                                    {
                                                                                        place.placeName
                                                                                    }{" "}
                                                                                    {/* ✅ 장소 이름 표시 */}
                                                                                </span>
                                                                            )}
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
                                                            )
                                                        )}
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
                                                            position:
                                                                "relative",
                                                            display:
                                                                "inline-block",
                                                        }}
                                                        ref={containerRef}
                                                    >
                                                        <input
                                                            ref={inputRef}
                                                            type="text"
                                                            value={newPlace}
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                            placeholder="장소 입력"
                                                            className="form-control w-auto me-2"
                                                            onKeyPress={
                                                                handleKeyPress
                                                            }
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
                                                    방문지는 7개까지만 입력
                                                    가능합니다 :)
                                                </span>
                                            )
                                        ) : (
                                            <span className="text-muted">
                                                방문지는 7개까지만 입력
                                                가능합니다 :)
                                            </span>
                                        )}

                                        <hr />
                                        <br />

                                        {selectedDate <= today ? (
                                            <>
                                                <Diary 
                                                diary={diary}
                                                editDiary={editDiary}
                                                setEditDiary={setEditDiary}
                                                coupleInfo={coupleInfo}
                                                diaryEntry={diaryEntry}
                                                saveDiary={saveDiary}
                                                diaryText={diaryText}
                                                yourDiaryText={yourDiaryText}
                                                setDiaryText={setDiaryText}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <Row>
                                                    <Col>
                                                        <h6>
                                                            <b>
                                                                지난 데이트
                                                                방문지
                                                            </b>
                                                        </h6>
                                                        {/* <ul className="list-group mb-3">
                                                        {pastPlaces.map(
                                                            (place, index) => (
                                                                <li
                                                                    key={index}
                                                                    className="list-group-item"
                                                                >
                                                                    {place}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul> */}
                                                    </Col>
                                                    <Col>
                                                        <h6>
                                                            <b>
                                                                이날은 여기서
                                                                놀아볼까요?
                                                            </b>
                                                        </h6>
                                                        <Card className="p-5">
                                                            <Card.Img
                                                                variant="top"
                                                                src="../../public/images/main1.png"
                                                            />
                                                            <Card.Body>
                                                                <Card.Title>
                                                                    서귀포
                                                                    감귤농장
                                                                </Card.Title>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </>
                                        )}
                                    </>
                                )
                            )
                        ) : (
                            "Loading..."
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Calendar;
