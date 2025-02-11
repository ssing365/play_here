import React, { useState } from "react";
import { Form } from "react-bootstrap";

const PasswordField = ({ formData, setFormData }) => {
  const [passwordMatch, setPasswordMatch] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "confirmPassword") {
      setPasswordMatch(e.target.value === formData.password ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <>
      <Form.Group controlId="formPassword" className="mb-3">
        <Form.Label>비밀번호</Form.Label>
        <Form.Control type="password" name="password" onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="formConfirmPassword" className="mb-3">
        <Form.Label>비밀번호 확인</Form.Label>
        <Form.Control type="password" name="confirmPassword" onChange={handleChange} required />
        {passwordMatch && <Form.Text>{passwordMatch}</Form.Text>}
      </Form.Group>
    </>
  );
};

export default PasswordField;