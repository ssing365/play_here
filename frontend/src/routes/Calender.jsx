import TopBar from "../components/TopBar";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";

const Calender = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [diaryEntry, setDiaryEntry] = useState("");
    const [month, setMonth] = useState(2);
    const [newPlace, setNewPlace] = useState("");
    const [showInput, setShowInput] = useState(false);

    const calendarData = [
        ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
        ["", "", "", "", "1", "2", "3"],
        ["4", "5", "6", "7", "8", "9", "10"],
        ["11", "12", "13", "14", "15", "16", "17"],
        ["18", "19", "20", "21", "22", "23", "24"],
        ["25", "26", "27", "28"],
    ];

    const initialPlaces = {
        4: ["백년옥 서초점", "프리퍼", "예술의전당", "미나미 서초점"],
        5: ["스타벅스 강남점", "코엑스몰", "롯데월드타워"],
    };

    const [places, setPlaces] = useState(initialPlaces);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(places[selectedDate] || []);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setPlaces({ ...places, [selectedDate]: items });
    };

    const addPlace = () => {
        if (newPlace.trim() !== "") {
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
            {/* Header */}
            <TopBar />
            <Container>
                {/* Main Content */}
                <Row className="mt-3">
                    {/* Left: Calendar */}
                    <Col md={6}>
                        <h4>김철수 ♥ 김유리</h4>
                        <div className="d-flex justify-content-between align-items-center">
                            <Button
                                variant="outline-secondary"
                                onClick={() => setMonth(month - 1)}
                            >
                                ◀ 이전 달
                            </Button>
                            <h5>{month}월</h5>
                            <Button
                                variant="outline-secondary"
                                onClick={() => setMonth(month + 1)}
                            >
                                다음 달 ▶
                            </Button>
                        </div>
                        <table className="table table-bordered text-center mt-2">
                            <tbody>
                                {calendarData.map((week, i) => (
                                    <tr key={i}>
                                        {week.map((day, j) => (
                                            <td
                                                key={j}
                                                className="p-3"
                                                style={{
                                                    cursor: day
                                                        ? "pointer"
                                                        : "default",
                                                }}
                                                onClick={() =>
                                                    day && setSelectedDate(day)
                                                }
                                            >
                                                {day}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Map Button */}
                        <div className="text-center mt-3">
                            <Link to="/map">
                                <Button variant="outline-success">
                                    지도 보기
                                </Button>
                            </Link>
                        </div>
                    </Col>

                    {/* Right: Selected Date Details */}
                    <Col md={6}>
                        {selectedDate && (
                            <>
                                <h4>
                                    {month}월 {selectedDate}일 화
                                </h4>
                                <h5>방문지 리스트</h5>
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
                                    <div className="mt-2">
                                        <Form.Control
                                            type="text"
                                            value={newPlace}
                                            onChange={(e) =>
                                                setNewPlace(e.target.value)
                                            }
                                            placeholder="장소 입력"
                                        />
                                        <Button
                                            className="mt-1"
                                            onClick={addPlace}
                                        >
                                            추가
                                        </Button>
                                    </div>
                                ) : (
                                    <a
                                        href="#"
                                        onClick={() => setShowInput(true)}
                                    >
                                        + 추가하기
                                    </a>
                                )}
                                <h5 className="mt-3">일기</h5>
                                <Row>
                                    <Col>
                                        <Card className="p-3">
                                            <h6>김철수</h6>
                                            <p>
                                                {diaryEntry ||
                                                    "일기를 남겨보세요"}
                                            </p>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={diaryEntry}
                                                onChange={(e) =>
                                                    setDiaryEntry(
                                                        e.target.value
                                                    )
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
            </Container>
        </>
    );
};

export default Calender;
