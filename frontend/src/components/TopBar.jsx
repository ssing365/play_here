import { useState, useEffect } from "react";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container, Row,  Col, Form, FormControl, Navbar, Nav, Dropdown, Button, Modal} from "react-bootstrap";
import axios from "axios";

const TopBar = () => {
    const remoteIp = import.meta.env.VITE_REMOTE_IP;
    const port = import.meta.env.VITE_PORT;

    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
    const [showModal, setShowModal] = useState(false); // 모달 표시 상태
    const [userInfo, setUserInfo] = useState(null); // 로그인 유저 정보
    const navigate = useNavigate();

    // 로그인 상태 확인 및 정보 추출
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // 쿠키를 포함하기 위해 withCredentials 옵션 사용
                const response = await axios.get(
                    "http://localhost:8586/api/user-info",
                    { withCredentials: true }
                );
                console.log("사용자 정보:", response.data);
                setUserInfo(response.data);
                setIsLoggedIn(true);
            } catch (error) {
                console.error("사용자 정보 가져오기 오류:", error);
                setIsLoggedIn(false);
            }
        };
        fetchUserInfo();
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
                                    src="/images/여기놀자.svg"
                                    alt="로고"
                                    className="h-8"
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
                                    className="text-gray-700 mx-3"
                                    style={
                                        location.pathname === "/search"
                                            ? {
                                                  color: "#e91e63",
                                                  fontWeight: "bold",
                                              }
                                            : {}
                                    }
                                >
                                    탐색
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="/calender"
                                    className="text-gray-700 mx-3"
                                    style={
                                        location.pathname === "/calender"
                                            ? {
                                                  color: "#e91e63",
                                                  fontWeight: "bold",
                                              }
                                            : {}
                                    }
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
                                        >
                                            {userInfo &&
                                            userInfo.profilePicture ? (
                                                <img
                                                    src={
                                                        `http://${remoteIp}:${port}/image/${userInfo.profilePicture}`
                                                    }
                                                    alt="프로필"
                                                    style={{
                                                        width: "32px",
                                                        height: "32px",
                                                        borderRadius: "50%",
                                                    }}
                                                />
                                            ) : (
                                                <FaUserCircle
                                                    className="h-8 w-8 text-gray-700"
                                                    style={{ fontSize: "32px" }}
                                                />
                                            )}
                                            <span style={{ marginLeft: "8px" }}>
                                                {userInfo && userInfo.nickname
                                                    ? userInfo.nickname
                                                    : ""}
                                            </span>
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
                                                to="/editpreference"
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
