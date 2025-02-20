import { Button, Row, Col, Carousel } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

const Top5 = () => {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [top5, setTop5] = useState([]);

    // 👉 일정 시간(4초)마다 자동으로 다음 이미지로 전환
    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 4000);

        return () => clearInterval(interval); // 컴포넌트가 언마운트되면 인터벌 제거2
    }, [index]); // index가 변경될 때마다 인터벌 재설정

    const handleNext = () => {
        if (!top5 || top5.length === 0) return;
        setDirection(1);
        setIndex((prevIndex) => (prevIndex + 1) % top5.length);
    };

    const handlePrev = () => {
        if (!top5 || top5.length === 0) return;
        setDirection(-1);
        setIndex((prevIndex) => (prevIndex - 1 + top5.length) % top5.length);
    };

    {
        /** 중간 섹션 : 사진만 슬라이드 되게 수정 -- 끝 */
    }

    useEffect(() => {
        if (top5 && top5.length > 0) {
            setIndex(0); // 새로운 데이터가 들어오면 index 초기화
        }
    }, [top5]);

    
    useEffect(()=>{
        const fetchTop5 = async () => {
            try {
                const response = await axios.get("http://localhost:8586/top5.do");
                console.log(response.data);
                setTop5(response.data);
            } catch (error) {
                console.error("장소 리스트 불러오기 실패:", error);
            }
        };
        fetchTop5();
    },[])


    return (
        <>
            <Carousel className="mt-5 mb-5" indicators={false} controls={false}>
                <Carousel.Item>
                    <Row>
                        {/* 왼쪽 설명은 고정 */}
                        <Col
                            md={4}
                            className="d-flex flex-column justify-content-center p-4"
                        >
                            <div
                                style={{
                                    backgroundColor: "#FFC7C7",
                                    padding: "5px 10px",
                                    borderRadius: "15px",
                                    display: "inline-block",
                                    fontSize: "12px",
                                }}
                            >
                                <b>여놀 PICK!</b>
                            </div>
                            <h4 className="mt-2 fw-bold">
                                여기놀자 좋아요 TOP5
                            </h4>
                        </Col>

                        {/* 오른쪽 이미지 변경 */}
                        <Col
                            md={8}
                            className="position-relative overflow-hidden"
                            style={{ height: "500px" }}
                        >
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.img
                                    key={index}
                                    src={
                                        top5.length > 0
                                            ? top5[index].image
                                            : "/images/placeholder.png"
                                    }
                                    className="d-block w-100 position-absolute"
                                    style={{
                                        objectFit: "cover",
                                        height: "500px",
                                    }}
                                    initial={{ x: direction * 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -direction * 100, opacity: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        ease: "easeInOut",
                                    }}
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
        </>
    );
};

export default Top5;
