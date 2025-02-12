import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import WeatherCard from "../components/WeatherCard"; // WeatherCard 추가
import '../index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Row, Col, Card, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

import { useState, useEffect, useRef } from "react";

const Search = () => {

    // 카테고리 default
    const [selectedCategory, setSelectedCategory] = useState('식당 & 카페');

    // 이미지 슬라이드용
    const carouselRef = useRef(null);

    // 주간 날짜 뽑기
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const [weekDates, setWeekDates] = useState([]);

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
        10: [{ name: '행사 1', img: '/images/main1.png' }, { name: '행사 2', img: '/images/main2.png' }, { name: '행사 3', img: '/images/main4.png' }],
        11: [{ name: '행사 A', img: '/images/main2.png' }, { name: '행사 B', img: '/images/main3.png' }, { name: '행사 C', img: '/images/main5.png' }],
        12: [{ name: '행사 D', img: '/images/main3.png' }, { name: '행사 I', img: '/images/main4.png' }, { name: '행사 N', img: '/images/main3.png' }],
        13: [{ name: '행사 E', img: '/images/main4.png' }, { name: '행사 J', img: '/images/main5.png' }, { name: '행사 O', img: '/images/main2.png' }],
        14: [{ name: '행사 F', img: '/images/main5.png' }, { name: '행사 K', img: '/images/main1.png' }, { name: '행사 P', img: '/images/main1.png' }],
        15: [{ name: '행사 G', img: '/images/main1.png' }, { name: '행사 L', img: '/images/main2.png' }, { name: '행사 Q', img: '/images/main4.png' }],
        16: [{ name: '행사 H', img: '/images/main2.png' }, { name: '행사 M', img: '/images/main3.png' }, { name: '행사 R', img: '/images/main5.png' }],
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

            <Link to={"/searchlist"}> <b>검색결과 리스트</b> </Link>
            <Link to={"/place"}> <b>장소 소개 페이지</b> </Link>
            
            {/* 메인 컨테이너 */}
            <Container className="mt-4">
                {/* 지금 가기 좋은 곳 */}
                <h4 style={{ fontWeight: 'bold', color: '#000000', marginTop: '20px' }}>지금 가기 좋은 곳 (or 선호도 기반 추천지)</h4>
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

                {/* 중간 섹션 : 큐레이션, 큰 사진*/}
                <Carousel className="mb-4" indicators={false} controls={false} ref={carouselRef}>
                    <Carousel.Item>
                        <Row>
                            <Col md={4} className="d-flex flex-column justify-content-center p-4" >
                                <div style={{ backgroundColor: '#FFC7C7', padding: '5px 10px', borderRadius: '15px', display: 'inline-block', fontSize: '12px' }}>추천 장소</div>
                                <h4 className="mt-2 fw-bold">여기놀자 좋아요 TOP5</h4>
                                <a href="#" className="text-decoration-none text-primary mt-2">자세히 보기 →</a>
                            </Col>
                            <Col md={8}>
                                <img
                                    className="d-block w-100"
                                    src="/images/main1.png"
                                    alt="제주 감귤농장"
                                    style={{ objectFit: 'cover', height: '500px' }}
                                />
                            </Col>
                        </Row>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Row>
                            <Col md={4} className="d-flex flex-column justify-content-center p-4">
                                <div style={{ backgroundColor: '#A0E7E5', padding: '5px 10px', borderRadius: '15px', display: 'inline-block', fontSize: '12px' }}>데이트 추천</div>
                                <h4 className="mt-2 fw-bold">여놀 선정 지금 꼭 가야하는 장소 5</h4>
                                <a href="#" className="text-decoration-none text-primary mt-2">자세히 보기 →</a>
                            </Col>
                            <Col md={8}>
                                <img
                                    className="d-block w-100"
                                    src="/images/main2.png"
                                    alt="제주 해변"
                                    style={{ objectFit: 'cover', height: '500px' }}
                                />
                            </Col>
                        </Row>
                    </Carousel.Item>
                </Carousel>
                <div className="d-flex justify-content-center gap-3 mb-3">
                    <Button variant="outline-dark" size="sm" onClick={() => carouselRef.current.prev()}>
                        <ChevronLeft />
                    </Button>
                    <Button variant="outline-dark" size="sm" onClick={() => carouselRef.current.next()}>
                        <ChevronRight />
                    </Button>
                </div>

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
