import TopBar from "../components/TopBar";
import "../css/MyPage.css"; // CSS 파일 import
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from "sweetalert2";

import { useContext, useEffect, useRef, useState } from 'react';
import { FormControl, Button, Container, Card, Modal } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from "react-router-dom";

import { CiShare2 } from "react-icons/ci";
import { UserContext } from "../contexts/UserContext";

const ConnectCouple = () => {
  const { userInfo, isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation(); //초대 코드 추출 시 사용
  
  // 상태 변수
  const [coupleCode, setCoupleCode] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);
  const [inputCode, setInputCode] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [inviterInfo, setInviterInfo] = useState(null);

  // ✅ 중복 실행 방지용 useRef
  const hasFetchedCoupleCode = useRef(false);
  const lastFetchedCode = useRef("");
  const hasRedirected = useRef(false);
  

  //로그인 안했으면, 로그인 페이지로
  useEffect(() => {
    if (!isLoggedIn && !hasRedirected.current) {
      // 🔹 현재 위치를 저장한 후 로그인 페이지로 리디렉션
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
    }
  }, [isLoggedIn, navigate, location]);
  
  //URL에서 초대코드 자동입력
  useEffect(()=> {
    const params = new URLSearchParams(location.search);
    const codeFromUrl = params.get("code");
    if(codeFromUrl){
      setInputCode(codeFromUrl); //입력란에 자동 입력
    }
  }, [location.search]);

  // // 커플 코드 가져오기(한번만 실행)
  // useEffect(() => {
  //   if (!isLoggedIn || !userInfo?.userId || coupleCode) return;  {
  //     console.log("🚀 커플 코드 조회 요청 실행됨!");  // ✅ 여기서 실행되는 횟수 확인
  //     fetchCoupleCode();
  //       hasFetchedCoupleCode.current = true;
  //   }
  // }, [isLoggedIn, userInfo?.userId]);

  useEffect(() => {
    if (!isLoggedIn || !userInfo?.userId || coupleCode) return;  // ✅ 불필요한 실행 방지
    console.log("🚀 커플 코드 조회 요청 실행됨!"); // 확인용 로그
    fetchCoupleCode();
  }, [isLoggedIn]); // ✅ userInfo 전체가 아니라 isLoggedIn만 감시

  const fetchCoupleCode = async () => {
    try {
      if (!userInfo?.userId) return; // ✅ 이미 코드가 있으면 실행 안함

      console.log("로그인한 유저의 아이디정보:", userInfo.userId); // ✅ userId 확인

      const response = await fetch(`http://localhost:8586/api/couple-code?userId=${userInfo.userId}`);
      if (!response.ok) {
        console.error('커플 코드 불러오기 실패:', response.status);
        return;
      }

      const data = await response.json();
      setCoupleCode(data.code);
      setUpdatedAt(data.updatedAt);
    } catch (error) {
      console.error('API 호출 에러:', error);
    }
  };

  // 🔹 초대자 정보 조회 (중복 요청 방지)
  // useEffect(() => {
  //   if (inputCode.trim() && lastFetchedCode.current !== inputCode) {
  //       fetchInviterInfo(inputCode);
  //       lastFetchedCode.current = inputCode;
  //   } else {
  //       setInviterInfo(null);
  //   }
  // }, [inputCode]);

  const fetchInviterInfo = async (code) => {
      const response = await fetch(`http://localhost:8586/api/couple/inviter-info?code=${code}`);
      if (!response.ok) {
        throw new Error("유효하지 않은 커플 코드입니다.(프론트)");
      }
      const data = await response.json();
      return data;
  };
  

  //(1) 초대 링크 생성 및 복사기능 추가
  const handleCopyLink = () => {
    if(!coupleCode){
      alert("커플 코드가 없습니다.");
      return; 
    }
    const inviteLink = `${window.location.origin}/connect-couple?code=${coupleCode}`;
    navigator.clipboard.writeText(inviteLink)
      .then(()=>alert("초대 링크가 복사되었습니다!"))
      .catch(err => console.error("링크 복사 실패:", err));
  }
  


  // 입력한 커플 코드가 변경될 때 초대자 정보 가져오기
  useEffect(() => {
    if (inputCode.trim()) {
      fetchInviterInfo(inputCode);
    } else {
      setInviterInfo(null);
    }
  }, [inputCode]);

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
  };

  useEffect(() => {
    if (coupleCode) {
      const intervalId = setInterval(() => {
        setTimeRemaining(computeTimeRemaining());
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [coupleCode]);

  // 모달 열기 & 닫기
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // '커플 연결' 버튼을 눌렀을 때 초대자 정보 확인 후 모달 열기
  const handleCheckCouple = async () => {
    if (!inputCode.trim()) {
      alert("커플 코드를 입력하세요.");
      return;
    }

    // 자기 자신의 커플 코드를 입력하면 차단
    if (inputCode === coupleCode) {
    alert("자기 자신과 커플을 맺을 수 없습니다.");
    return;
    }

    
      try{
      // fetchInviterInfo 호출하여 데이터를 받아옵니다.
      const data = await fetchInviterInfo(inputCode);
      console.log("초대자 정보:", data);

      // //날짜 비교 : 연/월/일이 다르면 만료된 커플 코드
      // const createdAt = new Date(data.createdAt); // API에서 받은 생성 날짜
      // const now = new Date();

      // // 날짜만 비교 (연, 월, 일 기준)
      // const createdDate = createdAt.toISOString().split("T")[0]; // "YYYY-MM-DD" 형식
      // const currentDate = now.toISOString().split("T")[0]; // "YYYY-MM-DD" 형식

      // if (createdDate !== currentDate) {
      //     alert("상대방의 커플 코드가 만료되었습니다. 상대방에게 다시 코드를 요청하거나, 자신의 커플 코드를 상대방에게 공유해주세요.");
      //     setInviterInfo(null);
      //     return;
      // }

      setInviterInfo(data);
    } catch (error) {
      console.error("초대자 정보 조회 실패:", error);
      setInviterInfo(null);
    }

    handleOpenModal();
  };

  // '확인' 버튼 클릭 → 커플 등록 API 요청
  const handleConfirmCouple = async () => {
    setShowModal(false);

    try {
      const response = await fetch("http://localhost:8586/api/couple/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userInfo.userId, 
          coupleCode: inputCode, 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("커플 연결 성공!");
        setCoupleCode("COUPLE");
        setInputCode("");
      } else {
        alert(data.message || "커플 연결 실패!");
      }
    } catch (error) {
      console.error("커플 연결 오류:", error);
      alert("서버 오류 발생");
    }
  };

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
      <TopBar />

      <Container className="mypage-container">
        <Card className="mypage-card text-center">
          <h5>연결하시면 더 많은 서비스를 이용하실 수 있습니다!</h5>

          <div className="my-4">
            <h6>내 커플코드</h6>
            <h3>{coupleCode || '불러오는 중...'}</h3>
            {coupleCode && <p>남은 커플코드 유효시간: {timeRemaining}</p>}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button variant="secondary" onClick={copyToClipboard}>코드 복사하기</Button>
              <CiShare2 className="icon-hover" style={{ marginLeft: '8px', cursor: 'pointer' }} onClick={handleCopyLink} />
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <FormControl 
              className="my-3 h-13 text-center"
              placeholder="연결할 커플코드를 입력하세요"
              value={inputCode}
              style={{ width: '400px' }}
              onChange={(e) => setInputCode(e.target.value)}
            />
            <Button className="menu-btn" style={{ width: '400px' }} onClick={handleCheckCouple}>
              💛 커플 연결하기 💛
            </Button>
          </div>

          {/* Bootstrap Modal */}
          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>커플 연결 확인</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {inviterInfo && (
                <p>
                  <strong>{inviterInfo.name} ({inviterInfo.nickname})</strong>님과 커플을 맺으시겠습니까?
                </p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>취소</Button>
              <Button variant="primary" onClick={handleConfirmCouple}>확인</Button>
            </Modal.Footer>
          </Modal>
        </Card>
      </Container>
    </div>
  );
};

export default ConnectCouple;
