import { useState, useEffect } from "react";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Form,
    FormControl,
    Navbar,
    Nav,
    Dropdown,
    Button,
    Modal,
} from "react-bootstrap";
import axios from "axios";

const TopBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
    const [showModal, setShowModal] = useState(false); // 모달 표시 상태
    const navigate = useNavigate();

    // 로그인 상태 확인
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8586/api/check-auth",
                    { withCredentials: true }
                );
                console.log(response);
                setIsLoggedIn(true);
            } catch (error) {
                console.log(error.response);
                console.log(error.response.status);
                if (error.response && error.response.status === 401) {
                    console.log(error);
                    setIsLoggedIn(false);
                } else {
                    console.error("로그인 오류:", error);
                    alert("서버 오류가 발생했습니다.");
                }
            }
        };
        checkAuth();
    }, [isLoggedIn]);

    // 로그아웃 함수
    const handleLoginToggle = async () => {
        try {
            // 로그아웃 API 호출 (withCredentials 옵션을 사용하여 쿠키 포함)
            const response = await axios.post(
                "http://localhost:8586/api/logout",
                {},
                { withCredentials: true }
            );
            if (response.data === "logout success") {
                // 로그인 상태 토글 및 UI 업데이트
                setIsLoggedIn(false);
                setShowModal(false);
                navigate("/login");
                alert("로그아웃 되었습니다.");
            }
        } catch (error) {
            console.error("로그아웃 오류:", error);
            alert("로그아웃 처리 중 오류가 발생했습니다.");
        }
    };

    // 캘린더 클릭 시 처리
    const handleCalendarClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault(); // 기본 페이지 이동 막기
            setShowModal(true); // 모달 표시
        }
    };

    const location = useLocation();

    return (
        <>
            <Navbar expand="md" bg="white" className="shadow-sm p-1 mb-4">
                <Container fluid>
                    <Row className="w-100 align-items-center">
                        {/* 로고 (좌측) */}
                        <Col
                            xs={6}
                            md={2}
                            className="text-md-start text-center mb-2 mb-md-0"
                        >
                            <Link to={"/"}>
                                <img
                                    src="/images/logo.png"
                                    alt="로고"
                                    className="h-8"
                                    style={{ width: "145px", height: "80px" }}
                                />
                            </Link>
                        </Col>

                        {/* 탐색/캘린더 메뉴 (중앙) - 큰 화면에서만 표시 */}
                        <Col
                            md={6}
                            className="d-none d-md-flex justify-content-center"
                        >
                            <Nav className="flex-row">
                                <Nav.Link
                                    as={Link}
                                    to="/search"
                                    className={`text-gray-700 mx-3 
                                    ${
                                        location.pathname === "/search"
                                            ? "fw-bold text-primary"
                                            : ""
                                    }`}
                                >
                                    탐색
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="/calender"
                                    className={`text-gray-700 mx-3 ${
                                        location.pathname === "/calender"
                                            ? "fw-bold text-primary"
                                            : ""
                                    }`}
                                    onClick={handleCalendarClick}
                                >
                                    캘린더
                                </Nav.Link>
                            </Nav>
                        </Col>

                        {/* 검색창 + 마이페이지 (우측) */}
                        <Col xs={6} md={4} className="text-end">
                            <div className="d-flex align-items-center justify-content-end">
                                <Form
                                    className="position-relative d-none d-md-block me-3"
                                    style={{ width: "300px" }}
                                >
                                    <FormControl
                                        type="text"
                                        placeholder="어떤 데이트를 하고 싶으신가요?"
                                        className="custom-input w-100"
                                    />
                                    <FaSearch
                                        className="position-absolute"
                                        style={{
                                            right: "10px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#6c757d",
                                        }}
                                    />
                                </Form>

                                {isLoggedIn ? (
                                    // 로그인 상태일 때 : 드롭다운 메뉴
                                    <Dropdown align="end">
                                        <Dropdown.Toggle
                                            variant="light"
                                            id="dropdown-user"
                                            className="border-0 p-0 bg-transparent"
                                            bsPrefix="custom-toggle"
                                        >
                                            <FaUserCircle
                                                className="h-8 w-8 text-gray-700"
                                                style={{ fontSize: "32px" }}
                                            />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                as={Link}
                                                to="/mypage"
                                            >
                                                마이페이지
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                as={Link}
                                                to="/connect-couple"
                                            >
                                                커플 연결하기
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                as={Link}
                                                to="/preference"
                                            >
                                                선호도 수정
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                as={Link}
                                                to="/mypagelikes"
                                            >
                                                좋아요 리스트
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item
                                                onClick={handleLoginToggle}
                                            >
                                                로그아웃
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                ) : (
                                    // 비로그인 상태일 때: 로그인 버튼
                                    <Button
                                        variant="primary"
                                        onClick={() => navigate("/login")}
                                        style={{
                                            backgroundColor: "#E91E63",
                                            borderColor: "#E91E63",
                                        }}
                                    >
                                        로그인
                                    </Button>
                                )}
                            </div>
                        </Col>
                    </Row>

                    {/* 작은 화면용 검색창 */}
                    <Row className="w-100 mt-2 d-md-none">
                        <Col xs={12}>
                            <Form className="position-relative">
                                <FormControl
                                    type="text"
                                    placeholder="어떤 데이트를 하고 싶으신가요?"
                                    className="border-bottom border-gray-400 pl-2 pr-5 py-2 w-100"
                                    style={{
                                        outline: "none",
                                        boxShadow: "none",
                                    }}
                                />
                                <FaSearch
                                    className="position-absolute"
                                    style={{
                                        right: "10px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#6c757d",
                                    }}
                                />
                            </Form>
                        </Col>
                    </Row>

                    {/* 작은 화면용 탐색/캘린더 메뉴 */}
                    <Row className="w-100 mt-3 d-md-none">
                        <Col xs={12}>
                            <Nav className="flex-column text-center">
                                <Nav.Link
                                    as={Link}
                                    to="/search"
                                    className="text-gray-700 my-1"
                                >
                                    탐색
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="/calender"
                                    className="text-gray-700 my-1"
                                >
                                    캘린더
                                </Nav.Link>
                            </Nav>
                        </Col>
                    </Row>
                </Container>
            </Navbar>

            {/* 로그인 요청 모달 */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body>캘린더를 이용하려면 로그인해야 합니다.</Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                    >
                        닫기
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => navigate("/login")}
                    >
                        로그인하기
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default TopBar;
