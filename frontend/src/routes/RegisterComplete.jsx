import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import "../css/MyPage.css"; // CSS 파일 import
import 'bootstrap/dist/css/bootstrap.min.css';

import { Button, Container, Card } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FireworksEffect from "./FireworksEffect"; // 추가!

const RegisterComplete = () => {
  const navigate = useNavigate();

  
  return (
    <div>
      <FireworksEffect />
      {/* 메인 컨테이너 */}
      <Container className="mypage-container" >
        <Card className="mypage-card text-center ">
          <div className="my-4">
            <h6><strong>💛 Welcome to 여놀 💛</strong></h6>
            <br />
            <br />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'  }}>
              <br />
              <h5><strong>회원가입이 완료되었습니다!</strong></h5>
              <br />
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'  }}>
            <Button className="menu-btn" style={{ width: '400px' }}
              onClick={()=> navigate('/login')}>
              로그인 하러 가기
            </Button>
            <h5><strong></strong></h5>
          </div>

          <Link to={"/"}>
            <Button variant="outline-secondary" className="w-30 mt-4">홈으로</Button>
          </Link>
        </Card>
      </Container>
    </div>
  );
};

export default RegisterComplete;
