import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const UserIdField = ({ formData, setFormData }) => {
  const [isUserIdChecked, setIsUserIdChecked] = useState(false);
  const [userIdMessage, setUserIdMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, user_id: e.target.value });
    setIsUserIdChecked(false);
  };

  const checkUserId = async () => {
    try {
      const response = await axios.post("/api/checkUserId", { user_id: formData.user_id });
      if (response.data.exists) {
        setUserIdMessage("중복된 아이디입니다.");
      } else {
        setUserIdMessage("사용 가능한 아이디입니다.");
        setIsUserIdChecked(true);
      }
    } catch (error) {
      setUserIdMessage("서버 오류로 인해 아이디 중복 확인을 할 수 없습니다. 잠시 후 다시 시도해 주세요.");
      setIsUserIdChecked(false);
    }
  };

  return (
    <Form.Group controlId="formUserId" className="mb-3">
      <Form.Label>아이디</Form.Label>
      <Form.Control type="text" name="user_id" value={formData.user_id} onChange={handleChange} required />
      <Button onClick={checkUserId} disabled={!formData.user_id || isUserIdChecked}>
        중복확인
      </Button>
      {userIdMessage && <Form.Text>{userIdMessage}</Form.Text>}
    </Form.Group>
  );
};

export default UserIdField;
