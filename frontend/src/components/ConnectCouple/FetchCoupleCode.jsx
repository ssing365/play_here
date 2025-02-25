import { useEffect, useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { CiShare2 } from "react-icons/ci";
import { FaShareFromSquare } from "react-icons/fa6";
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

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "여기놀자 커플 초대",
          text: "내 커플 코드로 연결해 보세요!",
          url: `${window.location.origin}/connect-couple?code=${coupleCode}`,
        });
        console.log("공유 성공!");
      } catch (error) {
        console.error("공유 실패:", error);
      }
    } else {
      alert("이 브라우저에서는 공유 기능을 사용할 수 없습니다.");
    }
  };
  

  return (<>
    <div className="text-center">
      <h4 style={{ marginBottom: '8px' }}>내 커플코드 </h4>
      <h3 onClick={copyToClipboard} > <b>{coupleCode || '불러오는 중...'}</b> </h3>
      <span className="text-secondary"
        style={{ display: 'block', fontSize: '13px', marginBottom: '10px', lineHeight: '1.5' }}>
        * 커플코드 클릭시 클립보드에 복사됩니다 *
      </span>
      {coupleCode && <p>남은 커플코드 유효시간: {timeRemaining}</p>}
      
      

      <div className='mb-3' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <Button 
          variant="secondary" 
          onClick={handleCopyLink} 
          style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          초대링크 복사하기 
        </Button>
        <CiShare2 style={{ fontSize: '20px', marginLeft: '5px', cursor: 'pointer' }} onClick={handleWebShare}/>
      </div>
      </div>
    </div>
  </>);
};

export default FetchCoupleCode;