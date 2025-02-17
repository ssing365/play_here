import { Button, Row, Col, Carousel } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const Top5 = () => {

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
        <>
            <Carousel className="mb-4" indicators={false} controls={false}>
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
                                    key={index} // key 값이 바뀌어야 애니메이션이 작동함
                                    src={images[index].src}
                                    alt={images[index].alt}
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
