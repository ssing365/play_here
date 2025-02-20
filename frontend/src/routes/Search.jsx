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
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    console.log("날짜:", selectedDate);
    const [weekDates, setWeekDates] = useState([]);
    
    // context에서 로그인 상태, 유저 정보 가져오기
    const { userInfo, isLoggedIn } = useContext(UserContext);

    // 날짜 출력
    useEffect(() => {
        const today = new Date();
        const dates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            return date;
        });
        setWeekDates(dates);
    }, []);

    // 주간 행사 더미
    const events = {
        [selectedDate]: [{ name: '행사 1', img: '/images/main1.png' }, { name: '행사 2', img: '/images/main2.png' }, { name: '행사 3', img: '/images/main4.png' }],
        [selectedDate+1] : [{ name: '행사 A', img: '/images/main2.png' }, { name: '행사 B', img: '/images/main3.png' }, { name: '행사 C', img: '/images/main5.png' }],
        [selectedDate+2] : [{ name: '행사 D', img: '/images/main3.png' }, { name: '행사 I', img: '/images/main4.png' }, { name: '행사 N', img: '/images/main3.png' }],
        [selectedDate+3] : [{ name: '행사 E', img: '/images/main4.png' }, { name: '행사 J', img: '/images/main5.png' }, { name: '행사 O', img: '/images/main2.png' }],
        [selectedDate+4] : [{ name: '행사 F', img: '/images/main5.png' }, { name: '행사 K', img: '/images/main1.png' }, { name: '행사 P', img: '/images/main1.png' }],
        [selectedDate+5] : [{ name: '행사 G', img: '/images/main1.png' }, { name: '행사 L', img: '/images/main2.png' }, { name: '행사 Q', img: '/images/main4.png' }],
        [selectedDate+6] : [{ name: '행사 H', img: '/images/main2.png' }, { name: '행사 M', img: '/images/main3.png' }, { name: '행사 R', img: '/images/main5.png' }],
    }

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
                            {weekDates.map((dateObj) => {
                                const date = dateObj.getDate();
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
                            {(events[selectedDate] || []).slice(0, 3).map((item, index) => (
                                <Col md={12} key={index} className="d-flex align-items-center mb-3">
                                    {console.log(events[selectedDate])}
                                    <img 
                                        src={item.img} 
                                        alt={item.name} 
                                        className="rounded"
                                        style={{ objectFit: 'cover', width: '150px', height: '150px' }} 
                                    />
                                    <div className="ms-3">
                                        <h6><strong>{item.name}</strong></h6>
                                        <p>행사 정보 행사정보 행사정보 행사정보 행사정보 행사정보 행사정보 행사정보 행사정보 행사정보 행사정보 행사정보 행사정보 행사정보 행사정보 행사정보 행사정보 행사정보 행사정보 행사정보 행사정보 행사정보 행사정보 행사정보 </p>
                                    </div>
                                </Col>
                            ))}
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
