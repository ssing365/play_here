import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Navbar, Nav, Form, Button, Row, Col } from "react-bootstrap";
import '../css/preference.css';
const SignupForm = () => {
  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
    confirmPassword: "",
    name: "",
    nickname: "",
    email: "",
    birth_date: "",
    address: "",
    profile_picture: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Process form submission
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="mb-4">회원가입</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUserId" className="mb-3">
              <Form.Label>아이디</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Enter user ID"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  required
                />
                <Button variant="outline-secondary" className="ms-2">
                  아이디 확인
                </Button>
              </div>
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className="mb-3">
              <Form.Label>비밀번호 확인</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>이름</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formNickname" className="mb-3">
              <Form.Label>별명</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>이메일</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBirthDate" className="mb-3">
              <Form.Label>생년월일</Form.Label>
              <Form.Control
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formAddress" className="mb-3">
              <Form.Label>주소</Form.Label>
              <Form.Control
                type="text"
                placeholder="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formProfilePicture" className="mb-3">
              <Form.Label>프로필 사진</Form.Label>
              <Form.Control
                type="text"
                placeholder="Profile Picture URL"
                name="profile_picture"
                value={formData.profile_picture}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              가입하기
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

const RegisterUser = () => {
  return (
    <>
      {/* 네비게이션 바 */}
      <Navbar bg="light" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand href="#">여기놀자</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#">탐색</Nav.Link>
              <Nav.Link href="#">캘린더</Nav.Link>
            </Nav>
            <Form className="d-flex">
              <Form.Control type="search" placeholder="어떤 데이트를 하고 싶으신가요?" className="me-2" />
              <Button variant="outline-success">검색</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 회원가입 폼 */}
      <SignupForm />
    </>
  );
};

export default RegisterUser;