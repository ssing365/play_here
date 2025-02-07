import TopBar from "../components/TopBar";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";

const Map = () => {
    
    const location = useLocation();
    const Date = location.state.selectedDate;

    const [selectedDate, setSelectedDate] = useState(Date);
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
                const position = new window.kakao.maps.LatLng(33.450701, 126.570667);
                const options = { center: position, level: 3 };
                new window.kakao.maps.Map(container.current, options);
            }
        }
    }, []);
    
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
        <>
            <TopBar />
            <Container>
            
            <Row className="mt-3">
            <Col md={6} className="position-relative">
            <div ref={container} style={{ width: "500px", height: "500px" }}></div>
            </Col>
                <Col md={6}>
                    {selectedDate && (
                        <>
                            <h4>{month}월 {selectedDate}일</h4>
                            <div className="d-flex align-items-center">
                                <h5 className="mb-0">방문지 리스트</h5>
                                <Link to="/map">
                                    <Button variant="outline-success" className="ms-3 border-0">지도 보기</Button>
                                </Link>
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
        </>
    );
};

export default Map;
