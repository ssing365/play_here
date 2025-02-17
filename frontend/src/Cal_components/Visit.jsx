import React, { useEffect, useReducer, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Form, Card, Col, Row, Button, Container } from "react-bootstrap";

function Visit({ selectedDate }) {
  const initialPlaces = {
    4: ["백년옥 서초점", "프리퍼", "예술의전당", "미나미 서초점"],
    5: ["스타벅스 강남점", "코엑스몰", "롯데월드타워"],
  };
  const initialState = {
    places: {},
    diary: {},
    diary2:{}
  };
  
  // 리듀서 함수
  const reducer = (state, action) => {
    switch (action.type) {
      case "ADD_PLACE":
        return {
          ...state,
          places: {
            ...state.places,
            [action.date]: [...(state.places[action.date] || []), action.place],
          },
        };
      case "DELETE_PLACE":
        return {
          ...state,
          places: {
            ...state.places,
            [action.date]: state.places[action.date].filter((_, i) => i !== action.index),
          },
        };
      case "UPDATE_DIARY":
        return {
          ...state,
          diary: { ...state.diary, [action.date]: action.entry },
        };
      case "REBATCH_PLACES":
        return {
          ...state,
          places: { ...state.places, [action.date]: action.places },
        };
      default:
        return state;
    }
  };
  // const navigator= useNavigate();
  const [state, dispatch]=useReducer(reducer,initialState);

  const [places, setPlaces] = useState(initialPlaces); //더미
  const [newPlace, setNewPlace] = useState("");
  
  const [diaryEntry, setDiaryEntry] = useState("");
  const [CoupdiaryEntry, setCoupDiaryEntry] = useState("");

  // const userIdRef=useRef();
// const userId=userId();

  // 방문했던 장소 검색?
//  const searchPlace({onSelect}){
//     const [query, setQuery]= useState("");
//     const [lastSearched, setLastSearched] =useState("");
//     const handleSearch = (e) => {
//       const value = e.target.value;
//       setQuery(value);
  
//       if (value.length > 1) {
//         fetch(`/api/places/search?query=${value}`)
//           .then((res) => res.json())
//           .then((data) => setSuggestions(data))
//           .catch((err) => console.error("검색 오류:", err));
//       } else {
//         setSuggestions([]);
//       }
//  }
//  }
// 날짜 별 방문 리스트  로드
// useEffect(() =>{
//   fetch(`/api/couple_visit?date=${selectedDate}`)
//   .then((res) => res.json())
//   .then((data) => setPlaces(data))
//   .catch((err) => console.error("방문지 로딩 오류:", err));
// }, [selectedDate]);


// const saveDiary1 = () => {
//   fetch("/api/diary", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ userId, date: selectedDate, content: diaryEntry }),
//   })
//     .then((res) => res.json())
//     .then(() => alert("일기 저장 완료!"))
//     .catch((err) => console.error("일기 저장 오류:", err));

// };

  // useEffect(()=>{   커플 매칭 확인?
  //   fetch(``)  //spring 매치 확인
  //   .then((res) => res.json())
  //     .then((data) => {
  //       if (!data.isCouple) {
  //         alert("커플이 아닙니다! 커플 매칭 페이지로 이동합니다.");
  //         navigator("/couple-matching");
  //       }
  //     })
  //     .catch((error) => console.error("커플 여부 확인 실패:", error));
  // }, []);

  // 방문지 추가
  const addPlace = () => {
    if (newPlace.trim()) {
      dispatch({ type: "ADD_PLACE", date: selectedDate, place: newPlace });
      setNewPlace("");
    }
  };

  // 방문지 삭제
  const deletePlace = (index) => {
    dispatch({ type: "DELETE_PLACE", date: selectedDate, index });
  };

  // 방문지 순서 변경 
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(state.places[selectedDate] || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    dispatch({ type: "REBATCH_PLACES", date: selectedDate, places: items });
  };

  return (
    <Container>
    <div className="visit-log">
      <div className="d-flex align-items-center">
        <h5 className="mb-0">방문지 리스트</h5>
        <Link to="/map" state={{ selectedDate: selectedDate }}>
          {/* <Button variant="outline-success" className="ms-3 border-0">
            지도 보기
            </Button> */} 
          <Button variant="outline-success" className="ms-3 border-0"> 지도 보기</Button>
              
        </Link>
      </div>

      <h2> 
        💖 {selectedDate ? selectedDate.toLocaleDateString() : "날짜"} 데이트
        코스 💖
      </h2>

{/* 검색을 통해 추가한 장소 드래그 및 삭제 뷰 */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="placesList">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="list-unstyled"
            >
              {places[selectedDate]?.map((place, i) => (
                <Draggable key={i} draggableId={place} index={i}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="list-group-item d-flex align-items-center"
                    >
                      <span
                        {...provided.dragHandleProps}
                        className="me-2"
                        style={{ cursor: "grab" }}
                      >
                        ☰
                      </span>
                      <span className="me-2">{i + 1}.</span> {place}

                  <button className="del-btn"
                    onClick={()=> deletePlace(i)}>❌</button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <div className="mt-2 d-flex align-items-center">
        <input
          type="text"
          value={newPlace}
          onChange={(e) => setNewPlace(e.target.value)}
          placeholder="다음 데이트 장소는?"
          className="form-control w-auto me-2"
        />
        <Button onClick={addPlace}>추가</Button>
      </div>
      <div className="card">
        <div className="card-title">🌸 </div>
      </div>

      <h5 className="mt-3">일기</h5>
      <Row>
        <Col>
          <Card className="p-3">
            {/* <h6><label htmlFor={`${userId}-name`}></label></h6> */}

           <h6>철수의 일기</h6> 
            <Form.Control
              as="textarea"
              rows={3}
              value={diaryEntry}
              onChange={(e) => handleDiaryChange("철수",e.target.value)}
              placeholder="일기를 입력하세요 " 
            />

            {/* <Button className="mt-3" onclick={saveDiary1}>
              저장
            </Button> */}

          </Card>
        </Col>

        <Col>
          <Card className="p-3">
            <h6>김유리</h6>
            <Form.Control
              as="textarea"
              rows={3}
              value={CoupdiaryEntry}
              onChange={(e) => setCoupDiaryEntry(e.target.value)}
              placeholder="일기를 입력하세요"
              
              
            />
            <Button className="mt-3">
              
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
      </Container>
  );
}

export default Visit;
