import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch } from "react-icons/fa";

const Calender = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [diaryEntry, setDiaryEntry] = useState("");
    const [month, setMonth] = useState(2);
    const [year, setYear] = useState(2025);
    const [newPlace, setNewPlace] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

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

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(places[selectedDate] || []);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setPlaces({ ...places, [selectedDate]: items });
    };

    return (
        <Container>
            <Navbar />
            <Row className="mt-3">
                <Col md={6} className="position-relative">
                    <h4 className="text-center">김철수 ♥ 김유리</h4>
                    <Row className="align-items-center justify-content-center pb-2">
                        <Col xs="auto" className="d-flex align-items-center">
                            <Button variant="outline-secondary" size="sm" onClick={() => setMonth(month - 1)} className="me-2 border-0">◀</Button>
                            <h5 className="mb-0">{year}년 {month}월</h5>
                            <Button variant="outline-secondary" size="sm" onClick={() => setMonth(month + 1)} className="ms-2 border-0">▶</Button>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end align-items-center mb-2">
                        {showSearch && (
                            <Form.Control
                                type="text"
                                placeholder="검색"
                                className="me-2"
                                style={{ width: "150px", height: "30px", transition: "opacity 0.3s ease-in-out", opacity: showSearch ? 1 : 0 }}
                            />
                        )}
                        <FaSearch style={{ cursor: "pointer", height:"30px" }} onClick={() => setShowSearch(!showSearch)} />
                    </div>
                    <table className="table table-bordered text-center mt-2">
                        <tbody>
                            {calendarData.map((week, i) => (
                                <tr key={i}>
                                    {week.map((day, j) => (
                                        <td key={j} className="p-3" style={{ cursor: day ? "pointer" : "default" }} onClick={() => day && setSelectedDate(day)}>
                                            {day}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                </Col>
                <Col md={6}>
                    {selectedDate && (
                        <>
                            <h4>{month}월 {selectedDate}일</h4>
                            <div className="d-flex align-items-center">
                                <h5 className="mb-0">방문지 리스트</h5>
                                <Link to="/map" state={{month:month, selectedDate:selectedDate}}>
                                    <Button variant="outline-success" className="ms-3 border-0">지도 보기</Button>
                                </Link>s
                            </div>

                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="placesList">
                                    {(provided) => (
                                        <ul {...provided.droppableProps} ref={provided.innerRef} className="list-unstyled">
                                            {places[selectedDate]?.map((place, i) => (
                                                <Draggable key={i} draggableId={place} index={i}>
                                                    {(provided) => (
                                                        <li ref={provided.innerRef} {...provided.draggableProps} className="list-group-item d-flex align-items-center">
                                                            <span {...provided.dragHandleProps} className="me-2" style={{ cursor: "grab" }}>☰</span>
                                                            <span className="me-2">{i + 1}.</span> {place}
                                                        </li>
                                                    )}
                                                </Draggable>
                                            ))}
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
                                        onChange={(e) => setNewPlace(e.target.value)}
                                        placeholder="장소 입력"
                                        className="form-control w-auto me-2"
                                    />
                                    <Button onClick={addPlace}>추가</Button>
                                </div>
                            ) : (
                                <a href="#" onClick={(e) => { e.preventDefault(); setShowInput(true); }}>+ 추가하기</a>
                            )}
                        <h5 className="mt-3">일기</h5>
                        <Row>
                            <Col>
                            <Card className="p-3">
                                <h6>김철수</h6>
                                <p>{diaryEntry || "일기를 남겨보세요"}</p>
                                <Form.Control 
                                as="textarea" 
                                rows={3} 
                                value={diaryEntry}
                                onChange={(e) => setDiaryEntry(e.target.value)}
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
    );
};

export default Calender;
