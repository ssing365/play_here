import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import WeatherCard from "../components/WeatherCard"; // WeatherCard 추가
import '../index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Row, Col, Card, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

    {/** 중간 섹션 : 사진만 슬라이드 되게 수정 -- 시작*/}
    const images = [
        { src: "/images/main1.png", alt: "제주 감귤농장" },
        { src: "/images/main2.png", alt: "제주 해변" }
    ];

    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(1);

    // 👉 일정 시간(4초)마다 자동으로 다음 이미지로 전환
    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 4000);

        return () => clearInterval(interval); // 컴포넌트가 언마운트되면 인터벌 제거
        }, [index]); // index가 변경될 때마다 인터벌 재설정

    const handleNext = () => {
        setDirection(1);
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };
    {/** 중간 섹션 : 사진만 슬라이드 되게 수정 -- 끝 */}

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* 상단바 */}
            <TopBar />
            
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

                {/* 중간 섹션 : 큐레이션, 큰 사진 슬라이드*/}
                <Carousel className="mb-4" indicators={false} controls={false}>
                <Carousel.Item>
                    <Row>
                        {/* 왼쪽 설명은 고정 */}
                        <Col md={4} className="d-flex flex-column justify-content-center p-4">
                            <div style={{ backgroundColor: '#FFC7C7', padding: '5px 10px', borderRadius: '15px', display: 'inline-block', fontSize: '12px' }}>
                                <b>여놀 PICK!</b>
                            </div>
                            <h4 className="mt-2 fw-bold">여기놀자 좋아요 TOP5</h4>
                            
                        </Col>

                        {/* 오른쪽 이미지 변경 */}
                        <Col md={8} className="position-relative overflow-hidden" style={{ height: "500px" }}>
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.img
                                    key={index} // key 값이 바뀌어야 애니메이션이 작동함
                                    src={images[index].src}
                                    alt={images[index].alt}
                                    className="d-block w-100 position-absolute"
                                    style={{ objectFit: 'cover', height: '500px' }}
                                    initial={{ x: direction * 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -direction * 100, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                />
                            </AnimatePresence>
                        </Col>
                    </Row>
                </Carousel.Item>
            </Carousel>
                <div className="d-flex justify-content-center gap-3 mb-3">
                    <Button variant="outline-dark" size="sm" onClick={handlePrev}>
                        <ChevronLeft />
                    </Button>
                    <Button variant="outline-dark" size="sm" onClick={handleNext}>
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
