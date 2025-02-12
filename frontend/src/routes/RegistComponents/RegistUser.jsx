import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import UserIdField from "./UserIdField";
import PasswordField from "./PasswordField";
import ProfilePictureUpload from "./ProfilePictureUpload";
import UserDetailsForm from "./UserDetailsForm";
import AddressForm from "./AddressForm";

const RegistUser = () => {
  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
    confirmPassword: "",
    name: "",
    nickname: "",
    email: "",
    birth_date: "",
    postcode: "",
    address: "",
    detailAddress: "",
    profile_picture: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("회원가입 완료!");
    console.log("제출 데이터:", formData);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="mb-4">회원가입</h2>
          <Form onSubmit={handleSubmit}>
            <UserIdField formData={formData} setFormData={setFormData} />
            <PasswordField formData={formData} setFormData={setFormData} />
            <ProfilePictureUpload formData={formData} setFormData={setFormData} />
            <UserDetailsForm formData={formData} setFormData={setFormData} />
            <AddressForm formData={formData} setFormData={setFormData} />
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