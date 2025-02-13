import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Button, Row, Col } from "react-bootstrap";

const RegistUser = () => {
  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
    confirmPassword: "",
    name: "",
    nickname: "",
    email: "",
    birth_date: "",
    address: "",
    profile_picture: null
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profile_picture: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 필수 입력 필드 검증
  const requiredFields = ["user_id", "password", "confirmPassword", "name", "nickname", "email"];
  for (const field of requiredFields) {
    if (!formData[field]?.trim()) {
      alert(`"${field}" 항목을 입력해 주세요.`);
      return;
    }
  }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Process form submission
    const formDataToSubmit = new FormData();
    for (const key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }
    // Add code to handle file upload and form submission
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="mb-4">회원가입</h2>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group controlId="formUserId" className="mb-3">
                  <Form.Label>아이디 <span className="text-danger">*</span></Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      placeholder="Enter user ID"
                      name="user_id"
                      value={formData.user_id}
                      onChange={handleChange}
                      style={{ flex: '1 1 auto' }}
                      required
                    />
                    <Button variant="outline-secondary" className="ms-2" style={{ whiteSpace: 'nowrap' }}>
                      중복확인
                    </Button>
                  </div>
                  <Form.Text className="text-muted">
                    아이디는 6~20자 이내, 영문과 숫자만 작성해야 합니다
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>비밀번호 <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    비밀번호는 8~20자 이내 영문, 숫자, 특수문자를 모두 사용해야 합니다
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mb-3">
                  <Form.Label>비밀번호 확인 <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="formProfilePicture" className="mb-3">
                  <Form.Label>프로필 사진</Form.Label>
                  <Form.Control
                    type="file"
                    name="profile_picture"
                    onChange={handleFileChange}
                  />
                  {preview && (
                    <div className="mt-3">
                      <img 
                        src={preview} 
                        alt="미리보기 이미지" 
                        className="img-fluid rounded" 
                        style={{ width: '200px', height: '200px', objectFit: 'cover' }} 
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>이름 <span className="text-danger">*</span></Form.Label>
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
              <Form.Label>별명 <span className="text-danger">*</span></Form.Label>
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
              <Form.Label>이메일 <span className="text-danger">*</span></Form.Label>
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

            <Button variant="primary" type="submit">
              가입하기
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistUser;
