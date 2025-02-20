import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Row} from 'react-bootstrap';


const RegisterTerms = () => {
  
  //이용약관 txt 파일 가져오기
  // serviceTerms: 이용약관,  privacyTerms:개인정보 처리방침
  const [serviceTerms, setserviceTerms] = useState("");
  const [privacyTerms, setprivacyTerms] = useState("");
  
  //약관 불러오기 
  useEffect(() => {
      //개인정보 처리방침 
      fetch("/terms/ServiceTerms.txt")
        .then((res) => res.text())
        .then((text) => setserviceTerms(text));

      //개인정보 처리방침 
      fetch("./terms/PrivacyTerms.txt")
        .then((res) => res.text())
        .then((text) => setprivacyTerms(text));
    }, []);

  const [accepted1, setAccepted1] = useState(false);
  const [accepted2, setAccepted2] = useState(false);
  const [acceptedAll, setAcceptedAll] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange1 = () => {
    setAccepted1(!accepted1);
    if (!accepted1 && accepted2) {
      setAcceptedAll(true);
    } else {
      setAcceptedAll(false);
    }
  };

  const handleCheckboxChange2 = () => {
    setAccepted2(!accepted2);
    if (accepted1 && !accepted2) {
      setAcceptedAll(true);
    } else {
      setAcceptedAll(false);
    }
  };

  const handleAgreeAllChange = () => {
    const newAcceptedAll = !acceptedAll;
    setAcceptedAll(newAcceptedAll);
    setAccepted1(newAcceptedAll);
    setAccepted2(newAcceptedAll);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accepted1 && accepted2) {
      navigate('/register-user', { state: { agreed: true }}); // 다음 페이지로 이동
    } else {
      alert('필수 약관에 동의하지 않았습니다.');
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-center mt-4">
      <h1>여기놀자 회원가입</h1>
      </div>
      <br/>
      <div className="d-flex justify-content-center mt-4">
      <p>여기놀자 회원가입을 하시면 여기놀자 사이트의 정보와 기능을 자유롭게 이용하실 수 있습니다.</p>
      </div>

      {/* 첫 번째 약관 */}
      <Row className="mb-4 d-flex justify-content-center">
        <div style={{ maxWidth: '800px' }}>
          <div style={{ 
            maxHeight: '200px', 
            overflowY: 'auto', 
            border: '1px solid #ccc', 
            padding: '10px'
          }}>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {serviceTerms}
            </pre>
          </div>
          
          {/* 체크박스를 약관 바깥쪽으로 배치 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Form.Check
              type="checkbox"
              label="동의"
              checked={accepted1}
              onChange={handleCheckboxChange1}
            />
          </div>
        </div>
      </Row>

      {/* 두 번째 약관 */}
      <Row className="mb-4 d-flex justify-content-center">
        <div style={{ maxWidth: '800px' }}>
          <div style={{ 
            maxHeight: '200px', 
            overflowY: 'auto', 
            border: '1px solid #ccc', 
            padding: '10px'
          }}>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {privacyTerms}
            </pre>
          </div>
          
          {/* 체크박스를 약관 바깥쪽으로 배치 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Form.Check
              type="checkbox"
              label="동의"
              checked={accepted2}
              onChange={handleCheckboxChange2}
            />
          </div>
        </div>
      </Row>

      {/* 전체 동의 체크박스 및 제출 버튼 */}
      <Row className="mb-4 d-flex justify-content-center">
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicCheckboxAll">
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px' }}>
              <Form.Check
                type="checkbox"
                label="모두 동의합니다"
                checked={acceptedAll}
                onChange={handleAgreeAllChange}
              />
            </div>
          </Form.Group>
          <div className="d-flex justify-content-center mt-4">
            <Button variant="primary" type="submit">
              회원 정보 입력하기
            </Button>
          </div>
        </Form>
      </div>
    </Row>
    <Link to={'/'}>
                    <span className="regist">    
                     메인으로 돌아가기   
                    </span>  
    </Link>   
    </Container>
  );
};

export default RegisterTerms;