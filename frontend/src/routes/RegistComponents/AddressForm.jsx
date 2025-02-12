import React from "react";
import { Form } from "react-bootstrap";

const AddressForm = ({ formData, setFormData }) => {
  return (
    <>
      <Form.Group controlId="formAddress" className="mb-3">
        <Form.Label>주소</Form.Label>
        <Form.Control type="text" name="address" value={formData.address} readOnly />
      </Form.Group>
    </>
  );
};

export default AddressForm;