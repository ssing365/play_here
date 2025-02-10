import React from "react";
import { Form } from "react-bootstrap";

const UserDetailsForm = ({ formData, setFormData }) => {
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <>
      <Form.Group controlId="formName" className="mb-3">
        <Form.Label>이름</Form.Label>
        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="formEmail" className="mb-3">
        <Form.Label>이메일</Form.Label>
        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
      </Form.Group>
    </>
  );
};

export default UserDetailsForm;