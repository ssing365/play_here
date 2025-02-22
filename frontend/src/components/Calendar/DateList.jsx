import { useState, useContext, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";

const DateList = ({ coupleInfo, selectedDate }) => {
    const [places, setPlaces] = useState([]);
    const [date, setDate] = useState(new Date());

    /* 방문지 리스트 출력 */
    const visitList = async (formattedDate) => {
        try {
            const response1 = await axios.post(
                "http://localhost:8586/visitList.do",
                { visitDate: formattedDate, coupleId: coupleInfo.coupleId }
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
        const formattedDate = date
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
            { visitDate: formattedDate, coupleId: coupleInfo.coupleId }
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
                    coupleId: coupleInfo.coupleId,
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

    /* 방문지 삭제 */
    const deletePlace = async (placeId) => {
        console.log(placeId);
        const formattedDate = date
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
                coupleId: coupleInfo.coupleId,
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
                                    draggableId={String(place.placeId)}
                                    index={i}
                                >
                                    {(provided) => (
                                        <li
                                            ref={provided.innerRef}
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
                                            {editId === place.placeId ? (
                                                <input
                                                    type="text"
                                                    value={editText}
                                                    onChange={(e) =>
                                                        setEditText(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={() => {
                                                        editPlace(
                                                            place.placeId,
                                                            editText
                                                        );
                                                        setEditId(null);
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") {
                                                            editPlace(
                                                                place.placeId,
                                                                editText
                                                            );
                                                            setEditId(null);
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
                                                    {place.placeName}{" "}
                                                    {/* ✅ 장소 이름 표시 */}
                                                </span>
                                            )}
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="ms-auto"
                                                onClick={() =>
                                                    deletePlace(place.placeId)
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
        </>
    );
};

export default DateList;
