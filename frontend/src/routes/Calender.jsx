import TopBar from "../components/TopBar";
import { Link } from "react-router-dom";
import { useState } from "react";
import {  Container,  Row,  Col  } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-calendar/dist/Calendar.css";
import { FaSearch } from "react-icons/fa";

import CalendarComponent from "../Cal_components/CalendarUI.jsx";
import Visit from "../Cal_components/Visit";
import conCouple from "../routes/ConnectCouple.jsx";
import "@fullcalendar/daygrid";

const Calender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); //날짜
  // const [diaryEntry, setDiaryEntry] = useState("");
  // const [month, setMonth] = useState(2);

  // const [newPlace, setNewPlace] = useState("");
  // const [showInput, setShowInput] = useState(false);

  // const [year, setYear] = useState(2025);
  // const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <TopBar />
      <h3 className="text-center">철수♥ 유리</h3>
      <Container className="container">
        <Row className="mt-3">
          <CalendarComponent
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          <Col md={6} className="position-relative">
            <Visit selectedDate={selectedDate} />

            {/* 커플연결 전 */}

            {/* <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'  }}>

            <FormControl 
              className="my-3 h-13 text-center"
              placeholder="연결할 커플코드를 입력하세요"
              value="{inputCode}"
              style={{ width: '400px' }}
              onChange={(e) => setInputCode(e.target.value)}
            />
            <Button className="menu-btn" style={{ width: '400px' }}>
              💛 커플 연결하기 💛
            </Button>
          </div>     */}

            {/* </div> 
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
                    </table> */}
          </Col>

         
        </Row>
      </Container>
    </>
  );
};

export default Calender;
