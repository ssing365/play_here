import Navbar from "../components/Navbar";
import Login from "./Login";
import { useState } from 'react';
import { FormControl, Button, Container, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CoupleCodeMatch = () => {
  const [coupleCode, setCoupleCode] = useState('AE6EWX');
  const [inputCode, setInputCode] = useState('');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coupleCode);
    alert('커플코드가 복사되었습니다!');
  };

  return (
    <div>
      {/* 상단바 */}
      <Navbar />

      {/* 메인 컨테이너 */}
      <Container className="d-flex justify-content-center py-5" style={{ maxWidth: '60%' }}>
        <div className="bg-blue text-white px-3 py-1 d-inline-block mb-3 rounded">
          <a href="Login">로그인하러가기</a>
        </div>
        <Card className="w-100 p-4 text-center shadow-sm">
          <div className="bg-dark text-white px-3 py-1 d-inline-block mb-3 rounded">마이페이지</div>
          <h5>연결하시면 더 많은 서비스를 이용하실 수 있습니다!</h5>

          <div className="my-4">
            <h6>내 커플코드</h6>
            <h3>{coupleCode}</h3>
            <Button variant="outline-secondary" onClick={copyToClipboard}>코드 복사하기</Button>
          </div>

          <Button variant="primary" className="w-50 my-2">커플코드 공유하기</Button>
          <FormControl
            className="my-3 text-center"
            placeholder="연결할 커플코드를 입력하세요"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
          <Button variant="success" className="w-50 my-2">커플 연결하기</Button>
          <Button variant="secondary" className="w-50 my-2">다음에하기</Button>
        </Card>
      </Container>
    </div>
  );
};

export default CoupleCodeMatch;
