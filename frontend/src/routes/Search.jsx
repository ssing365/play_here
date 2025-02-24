import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import Top5 from "../components/Main/Top5"
import WeatherCard from "../components/Main/WeatherCard"; // WeatherCard 추가
import '../index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from '../contexts/UserContext';

const Search = () => {
    // 카테고리 default
    const [selectedCategory, setSelectedCategory] = useState('식당 & 카페');




    // 주간 날짜 뽑기

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekDates, setWeekDates] = useState([]);
    
    // 행사 정보
    const [events, setEvents]=useState([])
    
    // context에서 로그인 상태, 유저 정보 가져오기
    const { userInfo, isLoggedIn } = useContext(UserContext);

    // 날짜 출력
        //   -->{ 해당날짜:[ {위치,제목, 이미지..}]}
    useEffect(() => {
    const fetchEvents = [
      {
        도시: "서울시",
        카테고리: "전시",
        제목: "안중근 의사 하얼빈 의거 115주년 기념 특별전 <안중근 書>",
        링크: "https://www.culture.go.kr/oneeye/oneEyeView.do?uci=G7061729718549755",
        날짜: "2024.10.24 ~ 2025.02.20",
        장소: "대한민국역사박물관"
      },
      {
        도시: "서울시",
        카테고리: "전시",
        제목: "2024 해치마당 미디어월 4회전시 <여정>",
        링크: "https://www.culture.go.kr/oneeye/oneEyeView.do?uci=G7061736286783584",
        날짜: "2024.12.10 ~ 2025.03.31",
        장소: "광화문광장",
        img: "https://www.culture.go.kr/upload/rdf/25/01/rdf_2025010721525753990.jpg"
      }
      // 다른 행사들 추가
    ];

    setEvents(fetchEvents);
    const dates = [];
    
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      dates.push(day);
    }
    setWeekDates(dates);
    setSelectedDate(dates[0]);  // 오늘 날짜를 기본으로 설정
}, []);


// 날짜를 기준으로 이벤트 필터링  기간 사이에 존재하면 반환
const filterEventsByDate = (events, selectedDate) => {
    // console.log("date", selectedDate);
    return events.filter(event => {
        // 날짜 형식을 YYYY-MM-DD로 변환하여 비교
        //   const startDate = new Date(event.날짜.split(' ~ ')[0]);  // 기간 형식으로 된 데이터 ex ) 25-01-20 ~ 25-02-28
        //   const endDate = new Date(event.날짜.split(' ~ ')[1]);
        const [startStr, endStr]=event.날짜.split(' ~ ');
        
        const startDate = new Date(startStr.replace(/\./g, '-'));
        const endDate = new Date(endStr.replace(/\./g, '-'));
        
        return selectedDate.getTime() >= startDate.getTime() && selectedDate.getTime() <= endDate.getTime();
        // return selectedDate >= startDate && selectedDate <= endDate;
      
    });
};

// 선택된 날짜에 해당하는 이벤트 필터링
const filteredEvents = filterEventsByDate(events,selectedDate);


    // 맨위 추천장소 더미
    const recommendations = {
        '식당 & 카페': ['/images/main3.png', '/images/main4.png', '/images/main5.png'],
        '가볼만한 곳': ['/images/main1.png', '/images/main2.png', '/images/main3.png'],
        '축제, 공연': ['/images/main3.png', '/images/main5.png', '/images/main4.png'],
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* 상단바 */}
            <TopBar />
            
            {/* 메인 컨테이너 */}
            <Container className="mt-4">
                {/* 지금 가기 좋은 곳 */}
                {isLoggedIn ? (
                        <h4 style={{ fontWeight: 'bold', color: '#000000', marginTop: '20px' }}>
                        {userInfo?.nickname || "Loading..."} 님을 위한 추천 </h4>
                    ):(
                        <h4 style={{ fontWeight: 'bold', color: '#000000', marginTop: '20px' }}>
                        지금 가기 좋은 곳 </h4>
                    )}
                <div className="d-flex gap-3 mb-3">
                    {['식당 & 카페', '가볼만한 곳', '축제, 공연'].map((category) => (
                        <Button 
                            key={category} 
                            variant={selectedCategory === category ? 'dark' : 'outline-dark'} 
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                <Row className="mb-4">
                    {recommendations[selectedCategory].map((imgSrc, index) => (
                        <Col key={index} md={4} className="mb-3">
                            <Card>
                                <Card.Img src={imgSrc} />
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* 중간 섹션 : 큐레이션, 큰 사진 슬라이드*/}

                <Top5/>

                {/* 주간 달력과 날씨 */}
                <Row>
                    {/* 행사 목록 (좌측 9칸) */}
                    <Col md={9}>
                        <h5><strong>이번 주 행사</strong></h5>
                        <div className="d-flex justify-content-between mb-2" style={{backgroundColor:"#FFC7C7", borderRadius:"10px", }}>
                            {weekDates.map((dateObj , index) => {
                                return (
                                    <div key={index}  className="text-center">
                                        
                                        <div
                                            className="p-2 mt-1 mb-1 ms-1 me-1 d-flex align-items-center justify-content-center"
                                            style={{
                                                backgroundColor: selectedDate.getDate() === dateObj.getDate() ? "#f6f6f6" : "transparent",
                                                borderRadius: "50%",
                                                width: "30px",
                                                height: "30px",
                                                cursor: "pointer",
                                                border: selectedDate.getDate() === dateObj.getDate() ? "1px solid #f6f6f6" : "none",
                                                fontSize: "14px"
                                            }}
                                            onClick={() => setSelectedDate(dateObj)  }
                                        >
                                            {dateObj.getDate()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* event 안에  장소정보 저장되어( db에서 가져온)|| */}
                        <Row>
                            {filteredEvents.map((event, index) => (
                                <Col md={12} key={index} className="d-flex align-items-center mb-3">
                                    <a href={event.링크} target="children"rel="noopener noreferrer">
                                    <img 
                                        src={event.img || "/default-image.jpg"}
                                        // alt={item.name} 
                                        className="rounded"
                                        style={{ objectFit: 'cover', width: '150px', height: '150px' }} 
                                        // onClick={() => window.open(event.링크)} // 이미지 클릭시 링크 이동
                                        />
                                        </a>
                                    <div className="ms-3">
                                        <span>{event.카테고리}</span>
                                        <h5>{event.제목}</h5>
                                        <p>{event.장소}</p>
                                        <p>{event.날짜}</p>
                                      </div>
                                  </Col>
                            ))}
                            {filteredEvents.length === 0&& (
                                <Col md={12} ><p>예정된 행사 없음</p></Col>
                            )}
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
