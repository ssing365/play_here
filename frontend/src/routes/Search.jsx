import TopBar from "../components/TopBar";
import Footer from "../components/Footer";

import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Row, Col, Card, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

const Search = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* 상단바 */}
            <TopBar />

            <Link to={"/searchlist"}>
                <b>검색결과 리스트</b>
            </Link>

            <Link to={"/place"}>
                <b>장소 소개 페이지</b>
            </Link>

            {/* 메인 컨테이너 */}
            <Container className="mt-4">
                {/* 지금 가기 좋은 곳 */}
                <h3>지금 가기 좋은 곳</h3>
                <div className="d-flex gap-2 mb-3">
                    <Button variant="primary">식당 & 카페</Button>
                    <Button variant="secondary">가볼만한 곳</Button>
                    <Button variant="secondary">축제, 공연</Button>
                </div>

                <Row className="mb-4">
                    <Col>
                        <Card>
                            <Card.Img src="/place1.jpg" />
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Img src="/place2.jpg" />
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Img src="/place3.jpg" />
                        </Card>
                    </Col>
                </Row>

                {/* 중간 섹션 */}
                <h3>제주도 서귀포 좋아요 베스트 5</h3>
                <Carousel className="mb-4">
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="/jeju1.jpg"
                            alt="제주 감귤농장"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="/jeju2.jpg"
                            alt="제주 해변"
                        />
                    </Carousel.Item>
                </Carousel>

                {/* 주간 달력과 날씨 */}
                <Row>
                    <Col md={9}>
                        <h4>이번 주 행사</h4>
                        <div className="d-flex justify-content-between mb-2">
                            {[23, 24, 25, 26, 27, 28, 29].map((date) => (
                                <div key={date} className="text-center">
                                    <div
                                        className="p-2 border rounded-circle"
                                        style={{
                                            backgroundColor:
                                                date === 23
                                                    ? "#007bff"
                                                    : "transparent",
                                            color:
                                                date === 23 ? "#fff" : "#000",
                                        }}
                                    >
                                        {date}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Row>
                            <Col>
                                <Card>
                                    <Card.Img src="/event1.jpg" />
                                    <Card.Body>행사 정보 1</Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <Card>
                                    <Card.Img src="/event2.jpg" />
                                    <Card.Body>행사 정보 2</Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <Card>
                                    <Card.Img src="/event3.jpg" />
                                    <Card.Body>행사 정보 3</Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>

                    <Col md={3}>
                        <h4>23일 날씨</h4>
                        <Card>
                            <Card.Body>날씨 API 데이터 표시 영역</Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Search;
