import TopBar from "../components/TopBar";
import "../css/MyPage.css"; // CSS 파일 import
import 'bootstrap/dist/css/bootstrap.min.css';

import { useEffect, useState } from 'react';
import { FormControl, Button, Container, Card } from 'react-bootstrap';
import { Link } from "react-router-dom";

import { CiShare2 } from "react-icons/ci";

const ConnectCouple = () => {

  // API에서 받아올 커플 코드와 갱신시간을 저장
  const [coupleCode, setCoupleCode] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);
  const [inputCode, setInputCode] = useState('')
  const [timeRemaining, setTimeRemaining] = useState('');
  
  //스프링부트 API에서 커플 코드 정보를 가져오는 함수

  const login = async () => {
    try {
      const response = await fetch('http://localhost:8586/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token); // 받은 토큰을 로컬 스토리지에 저장
      } else {
        console.error('로그인 실패');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
    }
  };

  const fetchCoupleCode = async () => {
  try {
    const authToken = localStorage.getItem('authToken'); // 로컬 스토리지에서 인증 토큰 가져오기
    const response = await fetch('http://localhost:8586/api/couple-code', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` // 실제 토큰 사용
      },
      credentials: 'include' // 필요에 따라 쿠키나 인증 정보를 포함
    });
    if (response.ok) {
      const data = await response.json();
      setCoupleCode(data.code);
      setUpdatedAt(data.updatedAt); // 필요하다면 사용 ( 현재는 남은 시간 계산에 사용하지 않음 )
    } else {
      console.error('커플 코드 불러오기 실패');
    }
  } catch (error) {
    console.error('API 호출 에러:', error);
  }
};
  
  //컴포넌트가 마운트 될 때 API 호출
  useEffect(() => {
    fetchCoupleCode();
  }, []);

  //남은 유효시간(예: 내일 자정까지)을 계산하는 함수
  const computeTimeRemaining = () => {
    const now = new Date();
    //내일 자정(즉, 오늘의 끝)을 계산
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);
    const diffMs = tomorrow - now;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return `${hours}시간 ${minutes}분 ${seconds}초`;
  }

  // coupleCode가 로드된 이후에만 타이머 시작
  useEffect(() => {
    if (coupleCode) {
      const intervalId = setInterval(() => {
        setTimeRemaining(computeTimeRemaining());
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [coupleCode]);

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
            <h3>{coupleCode || '불러오는 중...'}</h3>
            {/* coupleCode가 로드되었을 때만 남은 유효시간 표시 */}
            {coupleCode && <p>남은 커플코드 유효시간: {timeRemaining}</p>}
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

          <Link to={"/mypage"}>
            <Button variant="outline-secondary" className="w-30 mt-4">다음에하기</Button>
          </Link>
          
        </Card>
      </Container>
    </div>
  );
};

export default ConnectCouple;
