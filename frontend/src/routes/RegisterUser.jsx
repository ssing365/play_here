import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Navbar, Nav, Form, Button, Row, Col } from "react-bootstrap";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
    confirmPassword: "",
    name: "",
    nickname: "",
    email: "",
    birth_date: "",
    postcode:"",
    address: "",
    detailAddress:"",
    profile_picture: ""
  });

  // const [preview, setPreview] = useState(null); 에서
  //  null 부분에 이미지 넣으면 기본 이미지 표시 가능
  const [preview, setPreview] = useState(null);
  //에러메세지(아이디, 비밀번호)
  const [errors, setErrors] = useState({});
  //비밀번호 확인 메세지
  const [passwordMatch, setPasswordMatch] = useState("");
  //detailAddress 포커스하기
  const detailAddressRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const execDaumPostcode = () => {
    new window.daum.Postcode({
        oncomplete: (data) => {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                let addr = ''; // 주소 변수
                var extraAddr = ''; // 참고항목 변수
                //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                    addr = data.roadAddress;
                } else { // 사용자가 지번 주소를 선택했을 경우(J)
                    addr = data.jibunAddress;
                }

                // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
                if(data.userSelectedType === 'R'){
                  // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                  // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                  if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                      extraAddr += data.bname;
                  }
                  // 건물명이 있고, 공동주택일 경우 추가한다.
                  if(data.buildingName !== '' && data.apartment === 'Y'){
                      extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                  }
                  // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                  if(extraAddr !== ''){
                      extraAddr = ' (' + extraAddr + ')';
                  }
                  // 주소변수와 참고항목 변수 합치기 
                  addr += extraAddr;
                  } 

                setFormData({
                  ...formData,
                  postcode: data.zonecode,
                  address: addr
                });
                
                // detailAddressRef.current을 사용하여 포커스를 설정합니다.
                detailAddressRef.current.focus();
                
            }
        }).open();
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    //id 형식 실시간 검증하기 
    if (name === 'user_id'){
      if(!/^[a-zA-Z0-9]{6,20}$/.test(value)) {
        setErrors({
          ...errors,
          user_id: '아이디는 6~20자 이내, 영문과 숫자만 작성해야 합니다.',
        });
      } else {
        const newErrors = { ...errors };
        delete newErrors.user_id;
        setErrors(newErrors);
      }
    }

    //password 형식 실시간 검증하기
    if (name === 'password'){
      if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,20}$/.test(value)) {
        setErrors({
          ...errors,
          password: '비밀번호는 8~20자 이내 영문, 숫자, 특수문자를 모두 사용해야 합니다.',
        });
      } else {
        const newErrors = {...errors };
        delete newErrors.password;
        setErrors(newErrors);
      }
    }

    //비밀번호 칸과 비밀번호 확인 칸 내용이 일치하는지 실시간 검증
    if (name === 'confirmPassword'){
      if (value !== formData.password) {
        setPasswordMatch("비밀번호가 일치하지 않습니다.");
      } else {
        setPasswordMatch("비밀번호가 일치합니다.");
      }
    }

  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profile_picture: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호 칸과 비밀번호 확인에 입력한 비밀번호가 서로 다릅니다.");
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
                {/* 아이디 */}
                <Form.Group controlId="formUserId" className="mb-3">
                  <Form.Label>아이디 <span className="text-danger">*</span></Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      placeholder="아이디"
                      name="user_id"
                      value={formData.user_id}
                      onChange={handleChange}
                      style={{ flex: '1 1 auto' }}
                      required
                    />
                    {/* 아이디 중복확인 */}
                    <Button variant="outline-secondary" className="ms-2" style={{ whiteSpace: 'nowrap' }}>
                      중복확인
                    </Button>
                  </div>
                  {/* 아이디 실시간 검증 */}
                  {errors.user_id && (
                    <Form.Text className="text-danger">
                      {errors.user_id}
                    </Form.Text>
                  )}
                </Form.Group>

                {/* 비밀번호 */}
                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>비밀번호 <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="비밀번호"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  {/* 비밀번호 실시간 검증  */}
                  {errors.password && (
                    <Form.Text className="text-danger">
                      {errors.password}
                    </Form.Text>
                  )}
                </Form.Group>

                {/* 비밀번호 확인 */}
                <Form.Group controlId="formConfirmPassword" className="mb-3">
                  <Form.Label>비밀번호 확인 <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="비밀번호 확인"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  {/* 비밀번호 칸과 비밀번호 확인 칸 일치/ 불일치 여부 실시간 검증  */}
                  {passwordMatch && (
                    <Form.Text className={passwordMatch === "비밀번호가 일치합니다." ? "text-success" : "text-danger"}>
                      {passwordMatch}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              {/* 프로필 사진 넣기  */}
              <Col md={4}>
                <Form.Group controlId="formProfilePicture" className="mb-3">
                  <Form.Label>프로필 사진</Form.Label>
                  <Form.Control
                    type="file"
                    name="profile_picture"
                    onChange={handleFileChange}
                  />
                  {/* 업로드한 이미지 미리보기 */}
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

            {/* 이름 입력 */}
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>이름 <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="이름"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            {/* 별명 입력 */}
            <Form.Group controlId="formNickname" className="mb-3">
              <Form.Label>별명 <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="별명"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            {/* 이메일 */}
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>이메일 <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                placeholder="이메일"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* 생년월일 */}
            <Form.Group controlId="formBirthDate" className="mb-3">
              <Form.Label>생년월일</Form.Label>
              <Form.Control
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
              />
            </Form.Group>


            {/* 우편번호 입력 */}
            <Form.Group controlId="formPostcode" className="mb-3">
              <Form.Label>우편번호</Form.Label>
              <div className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="우편번호"
                    name="postcode"
                    value={formData.postcode}
                    readOnly
                    style={{ flex: '1 1 auto' }}
                  />
                  {/* 아이디 중복확인 버튼*/}
                  <Button variant="outline-secondary" className="ms-2" onClick={execDaumPostcode} style={{ whiteSpace: 'nowrap' }}>
                      우편번호 찾기
                  </Button>
              </div>
            </Form.Group>

            {/* 주소입력 */}
            <Form.Group controlId="formAddress" className="mb-3">
              <Form.Label>주소</Form.Label>
              <Form.Control
                type="text"
                placeholder="주소"
                name="address"
                value={formData.address}
                readOnly
              />
            </Form.Group>

            {/* 상세주소 입력 */}
            <Form.Group controlId="formDetailAddress" className="mb-3">
              <Form.Label>상세주소</Form.Label>
              <Form.Control
                type="text"
                placeholder="상세주소"
                name="detailAddress"
                value={formData.detailAddress}
                onChange={handleChange}
                ref={detailAddressRef}
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

export default RegisterUser;
