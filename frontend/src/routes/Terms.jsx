import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const TermsAndConditions = () => {
  const [accepted, setAccepted] = useState(false);

  const handleCheckboxChange = () => {
    setAccepted(!accepted);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (accepted) {
      alert('Terms and conditions accepted.');
    } else {
      alert('Please accept the terms and conditions.');
    }
  };

  return (
    <Container className="mt-5">
      <h1>Terms and Conditions</h1>
      <p>Please read and accept the terms and conditions to proceed.</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label="I accept the terms and conditions"
            checked={accepted}
            onChange={handleCheckboxChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default TermsAndConditions;