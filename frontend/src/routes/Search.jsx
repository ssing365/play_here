import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import Top5 from "../components/Main/Top5"
import WeatherCard from "../components/Main/WeatherCard"; // WeatherCard 추가
import RecomandPlaces from "../components/Main/RecomandPlaces";
import '../index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import { useContext } from "react";
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from "react-router-dom";

const Search = () => {
    // 카테고리 default
    const [selectedCategory, setSelectedCategory] = useState('식당 & 카페');

    // 주간 날짜 뽑기
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const [weekDates, setWeekDates] = useState([]);
    //행사정보
    const [events, setEvents] = useState({});
    
    // context에서 로그인 상태, 유저 정보 가져오기
    const { userInfo, isLoggedIn } = useContext(UserContext);
    const navigate = useNavigate(); // 페이지 이동 함수

    // 날짜 출력
    useEffect(() => {
        const today = new Date();
        const dates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            return {
                fullDate: date, // 실제 Date 객체 저장
                displayDate: date.getDate(), // UI에서 보여줄 날짜
            };
        });
        setWeekDates(dates);
    }, []);

    // 주간 행사 더미
    // 🎯 API에서 행사 데이터 가져오기
    useEffect(() => {
        fetch("http://localhost:8586/api/events/weekly")
            .then(response => response.json())
            .then(data => {
                const eventMap = {};

                data.forEach(event => {
                    const eventDate = new Date(event.startDate).getDate(); // 시작 날짜 기준으로 매칭
                    if (!eventMap[eventDate]) eventMap[eventDate] = [];
                    eventMap[eventDate].push({ 
                        id : event.placeId,
                        name: event.placeName, 
                        location: event.placeNameOnMap,
                        img: event.image === "이미지 없음" ? "/images/여기놀자.svg" : event.image, 
                        date: event.startDate + " ~ " + event.endDate ,
                        startDate: event.startDate, // Date 객체로 변환
                        endDate: event.endDate , // Date 객체로 변환
                    });
                });

                setEvents(eventMap);
            })
            .catch(error => console.error("행사정보 api 오류:", error));
    }, []);

    // 📌 상세 페이지 이동 함수
    const goToDetailPage = (placeId) => {
        navigate(`/place?id=${placeId}`);
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* 상단바 */}
            <TopBar />
            
            {/* 메인 컨테이너 */}
            <Container className="mt-4">
                
                {/* 지금 가기 좋은 곳 */}
                <RecomandPlaces />
                {/* 중간 섹션 : 큐레이션, 큰 사진 슬라이드*/}

                <Top5/>

                {/* 주간 달력과 날씨 */}
                <Row className="mt-5">
                    {/* 행사 목록 (좌측 9칸) */}
                    <Col md={9}>
                        <h5><strong>이번 주 행사</strong></h5>
                        <div className="d-flex justify-content-between mb-2" style={{backgroundColor:"#FFC7C7", borderRadius:"10px", }}>
                            {weekDates.map((dateObj) => {
                                const date = dateObj.fullDate.getDate();
                                return (
                                    <div key={date} className="text-center">
                                        <div
                                            className="p-2 mt-1 mb-1 ms-1 me-1 d-flex align-items-center justify-content-center"
                                            style={{
                                                backgroundColor: selectedDate === date ? "#f6f6f6" : "transparent",
                                                borderRadius: "50%",
                                                width: "30px",
                                                height: "30px",
                                                cursor: "pointer",
                                                border: selectedDate === date ? "1px solid #f6f6f6" : "none",
                                                fontSize: "14px"
                                            }}
                                            onClick={() => setSelectedDate(date)}
                                        >
                                            {date}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <Row>
                            {(() => {
                                // const eventList = events[selectedDate] || []; // 현재 선택한 날짜의 행사 목록
                                const selectedFullDate = useMemo(() => {
                                    // 선택한 날짜가 주간 캘린더(weekDates) 중에서 몇 번째인지 확인
                                    const selectedIndex = weekDates.findIndex(dateObj => dateObj.displayDate === selectedDate);
                                    
                                    if (selectedIndex === -1) return null; // 선택한 날짜가 주간 범위에 없을 경우 예외 처리

                                    // ✅ 선택한 날짜의 정확한 연/월/일 가져오기
                                    const selectedDateObj = weekDates[selectedIndex].fullDate;

                                    // ✅ YYYY-MM-DD 형식으로 변환
                                    const year = selectedDateObj.getFullYear();
                                    const month = (selectedDateObj.getMonth() + 1).toString().padStart(2, "0"); 
                                    const day = selectedDateObj.getDate().toString().padStart(2, "0"); 

                                    return `${year}-${month}-${day}`;
                                }, [selectedDate, weekDates]); // ✅ selectedDate & weekDates가 변경될 때만 실행

                                console.log("📌 선택한 날짜 (최종):", selectedFullDate);

                                // 🎯 현재 날짜보다 종료 날짜(endDate)가 큰 행사 리스트 찾기 (이미 끝난 행사 제외)
                                let possibleEvents = [];
                                Object.values(events).forEach(dayEvents => {
                                    dayEvents.forEach(event => {
                                        const eventStartDate = new Date(event.startDate + "T00:00:00"); // `T00:00:00` 추가하여 한국시간 기준 Date 객체 생성
                                        const eventEndDate = new Date(event.endDate + "T23:59:59"); // 끝나는 날까지 포함되도록 23:59:59 설정
                                        const selectedDateObj = new Date(selectedFullDate + "T00:00:00"); // 선택한 날짜 변환

                                        
                                        if (eventStartDate <= selectedDateObj && eventEndDate >= selectedDateObj) {
                                            possibleEvents.push(event);
                                        }
                                    });
                                });

                                // 🎯 StartDate(시작일) 기준으로 정렬 (최신 행사 순서대로 정렬)
                                possibleEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

                                // 🎯 상위 3개 이벤트만 선택
                                let filledEvents = possibleEvents.slice(0, 3);

                                return filledEvents.map((item, index) => (
                                    <Col md={12} key={index} className="d-flex align-items-center mb-3"
                                        style={{ cursor: item.id ? "pointer" : "default" }} 
                                        onClick={() => item.id && goToDetailPage(item.id)}
                                    >
                                        <img 
                                            src={item.img} 
                                            alt={item.name} 
                                            className="rounded"
                                            style={{ objectFit: 'cover', width: '150px', height: '150px' }} 
                                        />
                                        <div className="ms-3">
                                            <h6><strong>{item.name}</strong></h6>
                                            <p>{item.location}</p>
                                            <p>{item.date}</p>
                                        </div>
                                    </Col>
                                ));
                            })()}
                        </Row>
                    </Col>

                    {/* 날씨 카드 추가 (우측 3칸) */}
                    <Col md={3} className="d-flex justify-content-end">
                        <div className="d-flex justify-content-between mb-2"></div>
                        <WeatherCard />
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Search;
