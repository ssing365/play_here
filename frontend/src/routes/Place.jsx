import { useState } from "react";
import { Button, Card, Container, Row, Col} from "react-bootstrap";
import { Heart, Share, MapPin } from "lucide-react";
import TopBar from "../components/TopBar";

function Place() {
    const [view, setView] = useState("explore");

    return (
        <>
            {/* 헤더 */}
            <TopBar />
            <Container fluid className="bg-light min-vh-100">
                {/* 본문 */}
                <Container className="mt-4">
                    <img
                        src="/images/shooting-range.jpg"
                        alt="명동사격장"
                        className="w-100 rounded-3 mb-4"
                    />

                    <Row className="g-4">
                        {/* 1. 기본 정보 */}
                        <Col md={6}>
                            <h2 className="fw-bold">명동사격장</h2>
                            <p className="text-muted">서울 중구</p>
                            <p className="text-secondary">사격 체험</p>
                        </Col>
                        <Col md={6} className="text-end">
                            <Button
                                variant="outline-secondary"
                                className="me-2"
                            >
                                <Share size={20} />
                            </Button>
                            <Button variant="outline-danger" className="me-2">
                                <Heart size={20} />
                            </Button>
                            <Button variant="success">
                                캘린더에 일정 추가하기
                            </Button>
                        </Col>
                    </Row>

                    {/* 2. 소개글 */}
                    <Card className="mt-4">
                        <Card.Body>
                            학교, 직장, 인간관계에서의 스트레스를 한 방에 날려
                            버리기 적합한 곳
                        </Card.Body>
                    </Card>

                    {/* 3. 영업 정보 */}
                    <Card className="mt-4">
                        <Card.Body>
                            <p>
                                <strong>시간:</strong> 10:00 ~ 22:00
                            </p>
                            <p>
                                <strong>휴무:</strong> 월요일
                            </p>
                            <p>
                                <strong>주차:</strong> 가능
                            </p>
                        </Card.Body>
                    </Card>

                    {/* 4. 연락처 */}
                    <Card className="mt-4">
                        <Card.Body>
                            <p>
                                <strong>연락처:</strong> 02-333-3333
                            </p>
                        </Card.Body>
                    </Card>

                    {/* 5. 지도 */}
                    <Card className="mt-4">
                        <Card.Body>
                            <p>
                                <strong>주소:</strong> 서울특별시 중구 충무로2가
                                13-1
                            </p>
                            <div
                                className="position-relative bg-secondary rounded-3"
                                style={{ height: "250px" }}
                            >
                                <Button
                                    variant="outline-light"
                                    className="position-absolute top-2 end-2"
                                >
                                    <MapPin size={20} /> 길찾기
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* 6. 근처 다른 장소 */}
                    <h3 className="mt-4">근처 다른 장소</h3>
                    <Row className="g-3 flex-nowrap overflow-auto">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Col key={i} xs={6} md={3}>
                                <Card>
                                    <div
                                        className="bg-secondary rounded-top"
                                        style={{ height: "150px" }}
                                    ></div>
                                    <Card.Body>
                                        <p className="fw-bold">
                                            거전마을[농촌체험]
                                        </p>
                                        <p className="text-muted">
                                            부여군 온산면
                                        </p>
                                        <p className="text-secondary">
                                            체험 관광
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </Container>
        </>
    );
}

export default Place;
