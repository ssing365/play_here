
import { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import { Container, Button, Row, Badge } from "react-bootstrap";
import { Calendar, X } from 'lucide-react';
import TopBar from "../components/TopBar";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";


const MyPageLikes = () => {
  const { userInfo } = useContext(UserContext);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [openDatePickerIndex, setOpenDatePickerIndex] = useState(null);
  const userId = userInfo?.userId;
  const [interests, setInterests] = useState([]);  


  const fetchInterest = async () => {
    if (!userId) return; // userId가 없으면 실행 X

    try {
      const response = await axios.post(
        "http://localhost:8586/interests.do",
        { userId },  
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response.data); 
      setInterests(response.data || []);
    } catch (error) {
      console.error("장소 리스트 불러오기 실패:", error);
      setInterests([]); 
    }
  };

  useEffect(() => {    
    fetchInterest();
  }, [userId]); // ✅ userId가 바뀌면 새로 불러옴

  const handleMouseEnter = (index) => setHoverIndex(index);
  const handleMouseLeave = () => setHoverIndex(null);

  const handleDelete = (index) => {
    console.log(`항목 삭제: ${interests[index].name}`);
  };

  const handleDatePickerToggle = (index) => {
    setOpenDatePickerIndex(openDatePickerIndex === index ? null : index);
  };

  return (
    <>
      <TopBar />
      <Container className="mb-4">
        <h2 className="text-center">{userInfo?.nickname || "Loading..."}님의 좋아요 리스트</h2>
      </Container>

      <Container>
        {interests.length === 0 ? (
          <p className="text-center mt-5">아직 좋아요한 장소가 없습니다.</p>
        ) : (
          interests.map((interest, index) => (
            <div 
              key={index} 
              className="position-relative mb-3 d-flex" // 사진과 정보를 가로로 배치
              onMouseEnter={() => handleMouseEnter(index)} 
              onMouseLeave={handleMouseLeave}
            >
              <img 
                src={interest.image}
                alt={interest.name} 
                className="rounded"
                style={{ width: "250px", height: "200px", objectFit: "cover" }} 
              />
              <div className="ms-3">  {/* 이미지와 정보 간의 마진을 추가 */}
                <div className="position-absolute top-0 start-0 m-2">
                  <Badge bg="dark" className="opacity-75">{interest.category}</Badge>
                </div>
                
                <div className="mt-2">
                  <h5>{interest.place_name}</h5>
                  <p className="mb-1">{interest.location_short}</p>
                  <p className="mb-1">
                    {interest.tags?.map((tag, i) => (
                      <Badge bg="secondary" className="me-1" key={i}>{tag}</Badge>
                    ))}
                  </p>
                  <p className="text-muted">
                    ♥ {interest.likes}
                  </p>
                  
                    <div className="mt-3 d-flex gap-2">
                      {/* like 버튼 */}
                      <Button 
                        variant="light" 
                        className="rounded-circle p-1" 
                        onClick={() => handleDelete(index)}
                      >
                        <X size={20} />
                      </Button>
                      {/* 캘린더 버튼 */}
                      <Button 
                        variant="light" 
                        className="rounded-circle p-1" 
                        onClick={() => handleDatePickerToggle(index)}
                      >
                        <Calendar size={20} />
                      </Button>
                    </div>
                  
                  {openDatePickerIndex === index && (
                    <DatePicker 
                      shouldCloseOnSelect
                      dateFormat="yyyy-MM-dd"
                      id="datepicker1"
                      selected={startDate} 
                      onChange={(date) => setStartDate(date)} 
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </Container>

    </>
  );
};

export default MyPageLikes;
