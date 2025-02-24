import TopBar from "../components/TopBar";
import "../css/MyPage.css"; // CSS 파일 import
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from "sweetalert2";

import { useContext, useEffect, useState } from 'react';
import { FormControl, Button, Container, Card } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

import { CiShare2 } from "react-icons/ci";
import { UserContext } from "../contexts/UserContext";


const ConnectCouple = () => {

  const { userInfo, isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate(); //페이지이동

  // API에서 받아올 커플 코드와 갱신시간을 저장
  const [coupleCode, setCoupleCode] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);
  const [inputCode, setInputCode] = useState('')
  const [timeRemaining, setTimeRemaining] = useState('');
  
  //스프링부트 API에서 커플 코드 정보를 가져오는 함수
  const fetchCoupleCode = async () => {
    try {
      if (!userInfo || !userInfo.userId) {
        console.error("로그인된 유저 정보가 없습니다.");
        navigate("/Login"); // 로그인 화면으로 
        return;
      }

      console.log("로그인한 유저의 아아디정보:", userInfo.userId); // ✅ userId 확인

      const response = await fetch(`http://localhost:8586/api/couple-code?userId=${userInfo.userId}`); // ✅ 토큰 없이 userId 직접 전달
      if (!response.ok) {
        console.error('커플 코드 불러오기 실패:', response.status);
        return;
      }

      const data = await response.json();
      console.log("API 응답 데이터:", data); // ✅ 응답 확인
      setCoupleCode(data.code);
      setUpdatedAt(data.updatedAt);

    } catch (error) {
      console.error('API 호출 에러:', error);
    }
  };
  
  
  // ✅ 컴포넌트가 마운트 될 때 API 호출
  useEffect(() => {
    if (isLoggedIn && userInfo?.userId) { // ✅ 로그인 상태 & userId가 있을 때만 호출
      fetchCoupleCode();
    }
  }, [isLoggedIn, userInfo]);

  // 남은 유효시간 계산 함수
  const computeTimeRemaining = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);
    const diffMs = tomorrow - now;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return `${hours}시간 ${minutes}분 ${seconds}초`;
  }

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
    Swal.fire({
        text: '커플코드가 복사되었습니다.',
        timer: 1000,
        showConfirmButton: false,
        position:'top',
    })
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
