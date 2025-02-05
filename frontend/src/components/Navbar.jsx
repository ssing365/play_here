import { FaUserCircle, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, FormControl, Navbar, Nav } from 'react-bootstrap';

const NavBar = () => {
    return (
        <Navbar expand="md" bg="white" className="shadow-sm p-3 mb-4">
            <Container fluid>
                <Row className="w-100 align-items-center">
                    {/* 로고 (좌측) */}
                    <Col xs={6} md={2} className="text-md-start text-center mb-2 mb-md-0">
                        <Link to={"/"}>
                            <img src="/logo.png" alt="로고" className="h-8" style={{ height: '40px' }} />
                        </Link>
                    </Col>
                    {/* 탐색/캘린더 메뉴 (중앙) - 큰 화면에서만 표시 */}
                    <Col md={6} className="d-none d-md-flex justify-content-center">
                        <Nav className="flex-row">
                            <Nav.Link as={Link} to="/search" className="text-gray-700 mx-3">탐색</Nav.Link>
                            <Nav.Link as={Link} to="/calender" className="text-gray-700 mx-3">캘린더</Nav.Link>
                        </Nav>
                    </Col>

                    {/* 검색창 + 마이페이지 (우측) */}
                    <Col xs={6} md={4} className="text-end">
                        <div className="d-flex align-items-center justify-content-end">
                            <Form className="position-relative d-none d-md-block me-3" style={{ width: '300px' }}>
                                <FormControl
                                    type="text"
                                    placeholder="어떤 데이트를 하고 싶으신가요?"
                                    className="custom-input w-100"
                                />
                                <FaSearch className="position-absolute" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
                            </Form>
                            <Link to={"/mypage"}>
                                <FaUserCircle className="h-8 w-8 text-gray-700" />
                            </Link>
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
                                style={{ outline: 'none', boxShadow: 'none' }}
                            />
                            <FaSearch className="position-absolute" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
                        </Form>
                    </Col>
                </Row>

                {/* 작은 화면용 탐색/캘린더 메뉴 */}
                <Row className="w-100 mt-3 d-md-none">
                    <Col xs={12}>
                        <Nav className="flex-column text-center">
                            <Nav.Link as={Link} to="/search" className="text-gray-700 my-1">탐색</Nav.Link>
                            <Nav.Link as={Link} to="/calender" className="text-gray-700 my-1">캘린더</Nav.Link>
                        </Nav>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
};

export default NavBar;
