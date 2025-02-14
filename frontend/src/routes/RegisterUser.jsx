
import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
const RegisterUser = () => {
  const location = useLocation();
  //페이지이동
  const navigate = useNavigate();

  useEffect(() => {
    // 약관 동의 여부 확인
    if (!location.state?.agreed) {
      alert("약관에 동의해야 회원가입을 진행할 수 있습니다.");
      navigate("/register-terms"); // 약관 페이지로 다시 이동
    }
  }, [location, navigate]);

  //폼값
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
    profile_picture: null,
  });


  const defaultProfilePicture = "/images/head_logo.png"; // 기본 이미지 경로
  const remoteIp = import.meta.env.VITE_REMOTE_IP;
  const port = import.meta.env.VITE_PORT;

  // const [preview, setPreview] = useState(null); 에서
  //  null 부분에 이미지 넣으면 기본 이미지 표시 가능
  const [preview, setPreview] = useState(defaultProfilePicture);
  //에러메세지(아이디, 비밀번호)
  const [errors, setErrors] = useState({});
  //비밀번호 확인 메세지
  const [passwordMatch, setPasswordMatch] = useState("");
  //아이디 중복여부 버튼 클릭여부 확인
  const [isUserIdChecked, setIsUserIdChecked] = useState(false);
  //중복확인여부 버튼 클릭 후 메세지
  const [userIdMessage, setUserIdMessage] = useState("");

  //우편번호 검색 완료 후 detailAddress 포커스하기
  const detailAddressRef = useRef(null);

  useEffect(() => {
    if (!window.daum || !window.daum.Postcode) {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
    }
  }, []);

  //GPT 추가
  useEffect(() => {
    if (formData.confirmPassword) {
      setPasswordMatch(
        formData.password === formData.confirmPassword
          ? "비밀번호가 일치합니다."
          : "비밀번호가 일치하지 않습니다."
      );
    } else {
      setPasswordMatch(""); // 빈 문자열로 초기화
    }
  }, [formData.password, formData.confirmPassword]);
  
  //GPT 추가
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);


  const execDaumPostcode = () => {
    new window.daum.Postcode({
        oncomplete: (data) => {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                var addr = ''; // 주소 변수
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
                
                //바뀐 부분
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  postcode: data.zonecode,
                  address: addr
                }));
                
                // detailAddressRef.current을 사용하여 포커스를 설정합니다.
                detailAddressRef.current.focus();
                
            }
        }).open();
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setIsUserIdChecked(false); // 아이디가 변경되면 중복확인 상태를 초기화

    //id 형식 실시간 검증하기 
    //바뀐 부분
    if (name === 'user_id'){
      if(!/^[a-zA-Z0-9]{6,20}$/.test(value)) {
        setErrors((prevErrors)=>({
          ...prevErrors,
          user_id: '아이디는 6~20자 이내, 영문과 숫자만 작성해야 합니다.',
        }));
      } else {
        const newErrors = { ...errors };
        delete newErrors.user_id;
        setErrors(newErrors);
      }
    }

    //password 형식 실시간 검증하기
    if (name === 'password'){
      if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_])(?!.*\s).{8,20}$/.test(value)) {
        setErrors({
          ...errors,
          password: '비밀번호는 8~20자 이내 영문, 숫자, 특수문자를 모두 사용해야 하며 공백을 포함할 수 없습니다.',
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
    if (file){
      if(preview !== defaultProfilePicture){
        URL.revokeObjectURL(preview);
      }
    
    setFormData({ ...formData, profile_picture: file });
    setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // 필수 입력 필드 검증
    const requiredFields = ['user_id', 'password', 'confirmPassword', 'name', 'nickname', 'email'];
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        alert(`"${field}" 항목을 입력해 주세요.`);
        return;
      }
    }
  
    // 기존 검증 로직
    
    // 아이디 형식 재검증
    if (!/^[a-zA-Z0-9]{6,20}$/.test(formData.user_id)) {
      alert("아이디는 6~20자 이내, 영문과 숫자만 작성해야 합니다.");
      return;
    }
    // 비밀번호 형식 재검증
    if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_])(?!.*\s).{8,20}$/.test(formData.password)) {
      alert("비밀번호는 8~20자 이내 영문, 숫자, 특수문자를 포함해야 하며 공백을 포함할 수 없습니다.");
      return;
    }
    //비밀번호와 비밀번호 확인 일치 여부 검증
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
  
    // JSON으로 변환할 데이터에서 profile_picture 제거
    const { profile_picture, ...formDataWithoutFile } = formData;

    // FormData 생성
    const formDataToSubmit = new FormData();

     // JSON 데이터 문자열로 변환 후 추가
    formDataToSubmit.append("formData", JSON.stringify(formDataWithoutFile));

  
    // 프로필 사진 추가

    if (profile_picture && preview !== defaultProfilePicture) {
    formDataToSubmit.append("profile_picture", profile_picture);
    }
    
    // 서버로 전송, 회원가입 성공/실패 
    try {
      const response = await axios.post(`http://${remoteIp}:${port}/join/register.do`, formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.result === 1) {
        alert("회원가입이 완료되었습니다.");

        //formData에서 user_id 가져와 state로 전달
        const userId = formData.user_id;
        //로컬 스토리지 백업
        localStorage.setItem("userId", formData.user_id);
        navigate("/register-preference", { state: { userId } });

      } else {
        alert("회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 요청 중 오류 발생:", error);
      alert("서버 오류로 회원가입에 실패했습니다.");
    }
  };

  //아이디 중복확인 절차(ajax 활용)
  const checkUserId = async () => {
    if (!/^[a-zA-Z0-9]{6,20}$/.test(formData.user_id)) {
      setUserIdMessage("아이디는 6~20자 이내, 영문과 숫자만 작성해야 합니다.");
      return;
    }

    try {
      //추후 코드 수정 및 백엔드 작업 필요 - user 테이블 id  selcect 문으로 조회
      //결과 0이면 id 사용가능. 1이면 사용불가 
      
      const response = await axios.get(`http://localhost:8586/idcheck.do?`, {params:{ user_id: formData.user_id }});
      console.log(response.data)
      if (response.data.result === 1) {
        setUserIdMessage("중복된 아이디 입니다. 다른 아이디를 사용해주세요.");
        setIsUserIdChecked(false);
      } else {
        setUserIdMessage("사용가능한 아이디 입니다.");
        setIsUserIdChecked(true);
      }
    } catch (error) {
      console.error("Error checking user ID:", error);
      setUserIdMessage("서버 오류로 인해 아이디 중복 확인을 할 수 없습니다. 잠시 후 다시 시도해 주세요.");
      setIsUserIdChecked(false);
    }
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
                    readOnly={isUserIdChecked}
                  />
                  {/* 아이디 중복확인 */}
                  <Button
                    variant="outline-secondary"
                    className="ms-2"
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={checkUserId}
                    disabled={!/^[a-zA-Z0-9]{6,20}$/.test(formData.user_id) || isUserIdChecked}
                  >
                    중복확인
                    </Button>
                  </div>
                  {/* 아이디 실시간 검증 */}
                  {/*{errors.user_id && (
                    <Form.Text className="text-danger">
                      {errors.user_id}
                    </Form.Text>
                  )}*/}

                  {userIdMessage && (
                      <Form.Text className={userIdMessage === "사용가능한 아이디 입니다." ? "text-success" : "text-danger"}>
                        {userIdMessage}
                      </Form.Text>
                    )}
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
                        style={{ width: '200px', 
                                height: '200px', 
                                objectFit: 'contain',
                                backgroundColor: '#f0f0f0',
                                aspectRatio: '4 / 5', }} 
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
