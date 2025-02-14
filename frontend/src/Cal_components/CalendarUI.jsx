
import Calendar from "react-calendar";
import Visit from '../Cal_components/Visit'

import "react-calendar/dist/Calendar.css";
import '@fullcalendar/daygrid'
import "../css/Caldr.css"
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";

function CalendarComponent({ selectedDate, setSelectedDate }) {
      const [showSearch, setShowSearch] = useState(" ");
      


  return (
    
    <div className="calendar-container">
       <div className="d-flex justify-content-end align-items-center mb-2">
                {showSearch && (<Form.Control
                                type="text"
                                placeholder="검색"
                                className="me-2"
                                style={{ width: "100px", height: "30px", transition: "opacity 0.3s ease-in-out", opacity: showSearch ? 1 : 0 }}
                                />
                                )}
                               
                    </div>
      {/* <head>  Diary Log</head> */}
     <p> <FaSearch style={{position:"revert", cursor: "pointer", height:"30px", textAlign: "right" }}  
      onClick={() => setShowSearch(!showSearch)} /> 
      </p>

      <Calendar 
        onChange={setSelectedDate}
        value={selectedDate}
        
      />

    </div>
  );
}

export default CalendarComponent;
