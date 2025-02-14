import React, { useState } from "react";
import { Form } from "react-bootstrap";

const ProfilePictureUpload = ({ formData, setFormData }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profile_picture: file });
    setPreview(URL.createObjectURL(file));
  };

  return (
    <Form.Group controlId="formProfilePicture" className="mb-3">
      <Form.Label>프로필 사진</Form.Label>
      <Form.Control type="file" name="profile_picture" onChange={handleFileChange} />
      {preview && <img src={preview} alt="미리보기" width="100" />}
    </Form.Group>
  );
};

export default ProfilePictureUpload;