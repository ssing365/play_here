import TopBar from "../components/TopBar";
import "../css/MyPage.css"; // CSS 파일 import
import 'bootstrap/dist/css/bootstrap.min.css';

import { useState } from 'react';
import { FormControl, Button, Container, Card } from 'react-bootstrap';
import { Link } from "react-router-dom";

import { CiShare2 } from "react-icons/ci";

const ConnectCouple = () => {
  const [coupleCode, setCoupleCode] = useState('AE6EWX');
  const [inputCode, setInputCode] = useState('');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coupleCode);
    alert('커플코드가 복사되었습니다!');
  };

  return (
    <div>
      {/* 상단바 */}
      <TopBar />

      {/* 메인 컨테이너 */}
      <Container className="mypage-container" >
        <Card className="mypage-card text-center ">
          
          <h5>연결하시면 더 많은 서비스를 이용하실 수 있습니다!</h5>

          <div className="my-4">
            <h6>내 커플코드</h6>
            <h3>{coupleCode}</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'  }}>
              <Button variant="secondary" onClick={copyToClipboard}>코드 복사하기 </Button>
              <CiShare2  style={{ marginLeft: '8px' }}/>
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'  }}>
            <FormControl 
              className="my-3 h-13 text-center"
              placeholder="연결할 커플코드를 입력하세요"
              value={inputCode}
              style={{ width: '400px' }}
              onChange={(e) => setInputCode(e.target.value)}
            />
            <Button className="menu-btn" style={{ width: '400px' }}>
              💛 커플 연결하기 💛
            </Button>
          </div>

          <Link to={"/"}>
            <Button variant="outline-secondary" className="w-30 mt-4">다음에하기</Button>
          </Link>
          
        </Card>
      </Container>
    </div>
  );
};

export default ConnectCouple;
