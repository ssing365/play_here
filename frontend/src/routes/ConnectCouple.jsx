import TopBar from '../components/TopBar';
import FetchCoupleCode from '../components/ConnectCouple/FetchCoupleCode';
import RegisterCouple from '../components/ConnectCouple/RegisterCouple';

import "../css/MyPage.css"; // CSS 파일 import
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Card } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';

const ConnectCouple = () => {
  const { userInfo, isLoggedIn } = useContext(UserContext);
  const [coupleCode, setCoupleCode] = useState(userInfo?.coupleCode || null);
  const navigate = useNavigate();
  const location = useLocation();
 
  // useEffect(() => {
  //   // 유저 정보에서 커플 코드 확인
  //   if (userInfo?.coupleCode) {
  //     setCoupleCode(userInfo.coupleCode);
  //   }
  // }, [userInfo]);

  useEffect(() => {
    // 로그인하지 않은 경우, 로그인 페이지로 리디렉트하면서 현재 경로를 저장
    if (!isLoggedIn) {
        const currentPath = location.pathname + location.search;
        navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
        return;
    }

    // 유저 정보에서 커플 코드 확인
    // ✅ userInfo.coupleCode가 변경되면 coupleCode 업데이트
    if (userInfo?.coupleCode !== coupleCode) {
      setCoupleCode(userInfo.coupleCode);
    }
  }, [isLoggedIn, userInfo, navigate, location]);



  return (
    <div>
      <TopBar />
      <Container className="mypage-container">
        <Card className="mypage-card text-center" style={{maxHeight: '500px'}}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* coupleCode가 "COUPLE"일 때 이미지 표시, 그렇지 않으면 FetchCoupleCode */}
            {coupleCode === "COUPLE" ? (
              <img 
                src="/images/couple_connect_image.png" 
                alt="커플 연결 이미지"
                style={{ width: '300px', height: 'auto', marginBottom: '20px' }} 
                onClick={() => navigate('/calendar')}
              />
            ) : (
              <FetchCoupleCode setCoupleCode={setCoupleCode} />
            )}
            <RegisterCouple coupleCode={coupleCode} />
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default ConnectCouple;