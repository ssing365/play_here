import React, { useState } from "react";
import TopBar from "../components/TopBar";
import Cal from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/Calendar.css";
import { FaSearch } from "react-icons/fa";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";

const Calendar = () => {
    const [date, setDate] = useState(new Date());
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [places, setPlaces] = useState({});
    const [newPlace, setNewPlace] = useState("");
    const [diaryEntry, setDiaryEntry] = useState("");
    const [showInput, setShowInput] = useState(false);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(places[selectedDate] || []);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setPlaces({ ...places, [selectedDate]: items });
    };

    const addPlace = () => {
        if (newPlace.trim()) {
            setPlaces({
                ...places,
                [selectedDate]: [...(places[selectedDate] || []), newPlace],
            });
            setNewPlace("");
            setShowInput(false);
        }
    };

    return (
        <>
            <TopBar />
            <Row className="mt-3 couple-calendar-container">
                {/* 왼쪽 커플 캘린더 */}
                <Col
                    md={6}
                    className="calendar-column d-flex flex-column justify-content-between"
                >
                    <h4 className="text-center mb-3">김철수 ♥ 김유리</h4>

                    {/* 검색창과 돋보기 아이콘을 함께 묶은 박스 */}
                    <div className="search-container d-flex align-items-center justify-content-end mb-3">
                        <Form.Control
                            type="text"
                            placeholder="검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input me-2"
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
                    />
                </Col>

                {/* 오른쪽 방문지 리스트 */}
                <Col md={6} className="places-column">
                    {selectedDate && (
                        <>
                            <h4>
                                {date.getMonth() + 1}월 {selectedDate}일
                            </h4>
                            <div className="d-flex align-items-center mb-3">
                                <h5 className="mb-0">방문지 리스트</h5>
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
                                        지도 보기
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
                                                        key={i}
                                                        draggableId={place}
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
                                                                    className="me-2"
                                                                    style={{
                                                                        cursor: "grab",
                                                                    }}
                                                                >
                                                                    ☰
                                                                </span>
                                                                <span className="me-2">
                                                                    {i + 1}.
                                                                </span>{" "}
                                                                {place}
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
                                    />
                                    <Button onClick={addPlace}>추가</Button>
                                </div>
                            ) : (
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowInput(true);
                                    }}
                                >
                                    + 추가하기
                                </a>
                            )}

                            <h5 className="mt-3">일기</h5>
                            <Row>
                                <Col>
                                    <Card className="p-3 mb-2">
                                        <h6>김철수</h6>
                                        <p>
                                            {diaryEntry || "일기를 남겨보세요"}
                                        </p>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={diaryEntry}
                                            onChange={(e) =>
                                                setDiaryEntry(e.target.value)
                                            }
                                            placeholder="일기를 입력하세요"
                                        />
                                    </Card>
                                </Col>
                                <Col>
                                    <Card className="p-3">
                                        <h6>김유리</h6>
                                        <p>오늘 여기를 가서 행복했다.</p>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default Calendar;
