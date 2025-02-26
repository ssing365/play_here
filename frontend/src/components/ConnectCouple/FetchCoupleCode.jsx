import { useEffect, useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { CiShare2 } from "react-icons/ci";
import { UserContext } from "../../contexts/UserContext";

const FetchCoupleCode = ({ setCoupleCode }) => {
  const { userInfo, isLoggedIn } = useContext(UserContext);
  const [coupleCode, setLocalCoupleCode] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !userInfo?.userId || hasFetched) return;

    fetchCoupleCode();
    setHasFetched(true);
  }, [isLoggedIn, userInfo]);

  const fetchCoupleCode = async () => {
    try {
      if (!userInfo?.userId) return;

      const response = await fetch(`http://localhost:8586/api/couple-code?userId=${userInfo.userId}`);
      if (!response.ok) {
        console.error('커플 코드 불러오기 실패:', response.status);
        return;
      }

      const data = await response.json();

      // COUPLE이면 부모에게도 업데이트 (불필요한 렌더링 방지)
      if (data.code === "COUPLE") {
        setCoupleCode("COUPLE");
        return;
      }

      setLocalCoupleCode(data.code);
      setCoupleCode(data.code); // 부모 컴포넌트로 전달
    } catch (error) {
      console.error('API 호출 에러:', error);
    }
  };

  const computeTimeRemaining = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);
    const diffMs = tomorrow - now;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return `${hours}시간 ${minutes}분 ${seconds}초`;
  };

  useEffect(() => {
    if (coupleCode) {
      const intervalId = setInterval(() => {
        setTimeRemaining(computeTimeRemaining());
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [coupleCode]);

  const copyToClipboard = () => {
    if(coupleCode){
    navigator.clipboard.writeText(coupleCode);
    alert('커플코드가 복사되었습니다!');
    }
  };

  const handleCopyLink = () => {
    if (coupleCode) {
    const inviteLink = `${window.location.origin}/connect-couple?code=${coupleCode}`;
    navigator.clipboard.writeText(inviteLink)
      .then(() => alert("초대 링크가 복사되었습니다!"))
      .catch(err => console.error("링크 복사 실패:", err));
    }
  };

  return (<>
    <div className="text-center">
      <h6>내 커플코드</h6>
      <h3 onClick={copyToClipboard}>{coupleCode || '불러오는 중...'}</h3>
      {coupleCode && <p>남은 커플코드 유효시간: {timeRemaining}</p>}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button variant="secondary" onClick={handleCopyLink}>초대링크 복사하기 <CiShare2 style={{ display: 'inline' }} /> </Button>
      </div>
    </div>
  </>);
};

export default FetchCoupleCode;
