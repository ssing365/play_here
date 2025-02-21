import { useState, useContext, useEffect } from "react";
import TopBar from "../components/TopBar";
import Cal from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/Calendar.css";
import { FaSearch } from "react-icons/fa";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { v4 as uuidv4 } from "uuid"; // 드래그를 위한 고유한 ID 생성

const Calendar = () => {
    const [date, setDate] = useState(new Date());
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [places, setPlaces] = useState({});
    const [newPlace, setNewPlace] = useState("");
    const [diaryEntry, setDiaryEntry] = useState("");
    const [editDiary, setEditDiary] = useState(false);
    const [diaryText, setDiaryText] = useState(diaryEntry || "");
    const [showInput, setShowInput] = useState(false);
    const navigate = useNavigate();
    const today = new Date();
    // context에서 로그인 상태, 유저 정보 가져오기
    const { userInfo } = useContext(UserContext);

    /* 캘린더 최초 렌더링 시 오늘 날짜 자동 클릭 */
    useEffect(() => {
        setSelectedDate(today.getDate());
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
    const placeInput = document.getElementById("placeInput");
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
            placeInput.focus();
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

    /* 지난날짜~오늘 / 예정 날짜 구분 */
    const isPastOrToday = (selectedDate) => {
        const selected = new Date(
            date.getFullYear(),
            date.getMonth(),
            selectedDate
        );
        return selected <= today;
    };

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
    const saveDiary = () => {
        if (diaryText.trim()) {
            setDiaryEntry(diaryText);
        } else {
            setDiaryEntry("일기를 남겨주세요");
        }
        setEditDiary(false);
    };

    // 예정날짜 더미 : 지난 데이트 방문지, 추천 장소
    const pastPlaces = ["백년옥 서초점", "프리퍼", "예술의전당"];

    /**커플 아니면 이용 못하게
     * if (userInfo?.coupleStatus === 0) {
        return (
            <div className="muted-overlay">
                <div className="muted-message text-center">
                    <h6>캘린더를 이용하려면 커플 연결을 해야합니다 :(</h6>
                    <Link to="/connect-couple">
                        <button className="mt-3 couple-btn">
                            커플 연동하기
                        </button>
                    </Link>
                    <Link to="/search">
                        <button className="mt-3 btn btn-outline-secondary">
                            홈으로
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
     * 
     */

    return (
        <>
            <TopBar />
            <Row className="mt-3 couple-calendar-container">
                {/* 왼쪽 커플 캘린더 */}
                <Col
                    md={6}
                    className="calendar-column d-flex flex-column justify-content-between"
                >
                    <h4 className="mb-3">
                        {userInfo ? userInfo.nickname : "Loading..."} ❤ 커플
                        상대 닉네임
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
                        value={date}
                        onClickDay={(value) => setSelectedDate(value.getDate())}
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
                                        {date.getMonth() + 1}월 {selectedDate}일
                                    </h4>
                                    <div className="d-flex align-items-center mb-3">
                                        <b>방문지 리스트</b>
                                        <Link
                                            to="/map"
                                            state={{
                                                month: date.getMonth() + 1,
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
                                                                            {i +
                                                                                1}
                                                                            .{" "}
                                                                        </span>
                                                                        {editId ===
                                                                        place.id ? (
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
                                                                                        place.id,
                                                                                        editText
                                                                                    );
                                                                                    setEditId(
                                                                                        null
                                                                                    );
                                                                                }} // 포커스 해제 시 저장
                                                                                onKeyPress={(
                                                                                    e
                                                                                ) => {
                                                                                    if (
                                                                                        e.key ===
                                                                                        "Enter"
                                                                                    ) {
                                                                                        editPlace(
                                                                                            place.id,
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
                                                                                        place.id
                                                                                    );
                                                                                    setEditText(
                                                                                        place.name
                                                                                    );
                                                                                }}
                                                                                className="me-2 p-1"
                                                                            >
                                                                                {
                                                                                    place.name
                                                                                }
                                                                            </span>
                                                                        )}
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
                                                id="placeInput"
                                                onKeyPress={(e) =>
                                                    e.key === "Enter" &&
                                                    addPlace()
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
                                                onClick={() =>
                                                    setShowInput(false)
                                                }
                                            >
                                                취소
                                            </button>
                                        </div>
                                    ) : places[selectedDate]?.length < 7 ||
                                      places[selectedDate]?.length ==
                                          undefined ? (
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
                                            {" "}
                                            방문지는 7개까지만 입력 가능합니다
                                            :)
                                        </span>
                                    )}
                                    <hr />
                                    <br />
                                    {isPastOrToday(selectedDate) ? (
                                        <>
                                            <Row>
                                                <Col>
                                                    <Card className="p-3 mb-2">
                                                        <h6>
                                                            <b>내 일기</b>
                                                        </h6>
                                                        {editDiary ? (
                                                            <div>
                                                                <Form.Control
                                                                    as="textarea"
                                                                    rows={3}
                                                                    value={
                                                                        diaryText
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setDiaryText(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    onKeyPress={(
                                                                        e
                                                                    ) => {
                                                                        if (
                                                                            e.key ===
                                                                            "Enter"
                                                                        ) {
                                                                            e.preventDefault();
                                                                            saveDiary();
                                                                        }
                                                                    }}
                                                                    autoFocus
                                                                />
                                                                <div className="d-flex justify-content-end mt-2">
                                                                    <Button
                                                                        onClick={
                                                                            saveDiary
                                                                        }
                                                                        className="add-btn"
                                                                    >
                                                                        저장
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p
                                                                onClick={() =>
                                                                    setEditDiary(
                                                                        true
                                                                    )
                                                                }
                                                                className="text-muted"
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                {diaryEntry ||
                                                                    "일기를 남겨주세요"}
                                                            </p>
                                                        )}
                                                    </Card>
                                                </Col>
                                                <Col>
                                                    <Card className="p-3">
                                                        <h6>
                                                            <b>
                                                                커플 상대 닉네임
                                                            </b>
                                                        </h6>
                                                        <p>
                                                            오늘 여기를 가서
                                                            행복했다.
                                                        </p>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </>
                                    ) : (
                                        <>
                                            <Row>
                                                <Col>
                                                    <h6>
                                                        <b>
                                                            지난 데이트 방문지
                                                        </b>
                                                    </h6>
                                                    <ul className="list-group mb-3">
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
                                                    </ul>
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
                                                                서귀포 감귤농장
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
        </>
    );
};

export default Calendar;
