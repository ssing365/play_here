import TopBar from "../components/TopBar.jsx";
import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-calendar/dist/Calendar.css";
import CalendarUI from "../Cal_components/CalendarUI.jsx";
import Visit from "../Cal_components/Visit.jsx";
import { useQuery } from "@tanstack/react-query";

const PORT = import.meta.env.VITE_PORT;
const IP = import.meta.env.VITE_REMOTE_IP;
const URL = `http://${IP}:${PORT}`;

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const coupleId = localStorage.getItem("coupleId"); 

  console.log("📌 localStorage coupleId:", coupleId);

  const fetchVisitedPlaces = async () => {
    if (!coupleId) {
      throw new Error("❌ coupleId가 없습니다!");
    }
    const formattedDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD 형식 변환
    const response = await fetch(`${URL}/api/Calendar?coupleId=${coupleId}&visitDate=${formattedDate}`);

    if (!response.ok) {
      throw new Error(`❌ 서버 응답 오류: ${response.status}`);
    }

    return response.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["visitedPlaces", coupleId, selectedDate], 
    queryFn: fetchVisitedPlaces,
    enabled: !!coupleId, // coupleId가 있을 때만 실행
  });

  if (isLoading) return <p>⏳ 로딩 중...</p>;
  if (error) return <p>❌ 오류 발생: {error.message}</p>;

  return (
    <>
      <TopBar />
      <Container>
        <Row className="mt-3">
          <CalendarUI selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          <Col md={6}>
            <Visit selectedDate={selectedDate} data={data} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Calendar;
