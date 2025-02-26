import { useState, useEffect, useContext } from 'react';
import { FormControl, Button, Modal } from 'react-bootstrap';
import { UserContext } from "../../contexts/UserContext";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const RegisterCouple = ({ coupleCode }) => {
  const { userInfo } = useContext(UserContext);
  const [inputCode, setInputCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [inviterInfo, setInviterInfo] = useState(null);
  const [isCoupleConnected, setIsCoupleConnected] = useState(false);
  const navigate = useNavigate();

  const showError = (title, text) => {
    Swal.fire({icon: "error", title, text});
  };

  useEffect(() => {
    //URL에서 초대 코드 가져오기
    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get("code");
    if (codeFromUrl) {
      setInputCode(codeFromUrl);
    }
  }, []);

  

  //디버깅
  useEffect(() => {
    // 🚀 커플 코드가 "COUPLE"이면 자동으로 연결된 상태로 변경
    if (coupleCode === "COUPLE") {
      setIsCoupleConnected(true);
    }
  }, [coupleCode]);

  // (1) 커플 코드 유효성 검증 API 호출
  const fetchInviterCodeInfo = async (code) => {
    try {
      const response = await fetch(`http://localhost:8586/api/couple/inviter-code-info?code=${code}`);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error("커플 코드 유효성 검사 실패:", error);
      return null;
    }
  };

  //  (2) 초대자 정보 조회 API 호출
  const fetchInviterInfo = async (code) => {
    try {
      const response = await fetch(`http://localhost:8586/api/couple/inviter-info?code=${code}`);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error("초대자 정보 조회 실패:", error);
      return null;
    }
  };

  
  //커플 코드 검증하기
    const handleCheckCouple = async () => {
      if (!userInfo?.userId) {
        showError("사용자 정보 없음!", "로그인이 필요한 기능입니다.");
        return;
      }
    
      if (!inputCode.trim()) {
        showError("커플 코드 입력 없음!", "커플 코드를 입력해주세요.");
        return;
      }
    
      if (String(inputCode) === String(coupleCode) || String(inputCode) === String(userInfo.userId)) {
        showError("자신의 코드 입력!", "자기 자신과 커플을 맺을 수 없습니다.");
        return;
      }

    //커플 코드 유효성 검사
    const codeData = await fetchInviterCodeInfo(inputCode);
    if (!codeData) {
      showError("유효하지 않은 코드","유효하지 않은 커플 코드입니다. 커플 코드를 확인한 후 다시 입력해주세요.");
      return;
    }

    // 날짜 검증 (updatedAt이 오늘 날짜인지 확인)
    const createdAt = new Date(codeData.updatedAt);
    const now = new Date();

    const createdDate = createdAt.toISOString().split("T")[0]; // YYYY-MM-DD
    const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD

    if (createdDate !== currentDate) {
      showError("만료된 커플 코드","커플 코드가 만료되었습니다. 상대방에게 다시 코드를 요청하거나, 자신의 커플 코드를 상대방에게 공유하세요.")
      return;
    }

    // 초대자 정보 조회
    const inviterData = await fetchInviterInfo(inputCode);
    if (!inviterData) {
      showError("초대자 정보 없음","해당 코드로 초대자를 찾을 수 없습니다.")
      return;
    }


     //초대자 정보 설정 후 모달 열기
      setInviterInfo(inviterData);
      setShowModal(true);
    
  };

  //커플 연결하기
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
        setInputCode("");
        setIsCoupleConnected(true); // 커플 연결 성공 상태 변경
      } else {
        alert(data.message || "커플 연결 실패!");
      }
    } catch (error) {
      console.error("커플 연결 오류:", error);
      alert("서버 오류 발생");
    }
  };

  return (
    <div className="text-center">
      {!isCoupleConnected ? (
        <>
          <FormControl 
            className="my-3 text-center"
            placeholder="연결할 커플코드를 입력하세요"
            value={inputCode}
            style={{ maxWidth: '400px', width: '100%' }}
            onChange={(e) => setInputCode(e.target.value)}
            disabled={isCoupleConnected} // 연결 성공 시 입력 비활성화
          />
          <Button className="menu-btn" style={{ width: '400px' }} onClick={handleCheckCouple} disabled={isCoupleConnected}>
            💛 커플 연결하기 💛
          </Button>
        </>
      ) : (
        <div className="text-center mt-3">
          <h4>🎉 커플 연결을 축하합니다! 🎉</h4>
          <Button className="menu-btn mt-2" style={{ width: '400px' }} onClick={() => navigate('/calendar')}>
            📅 커플 캘린더 가기 📅
          </Button>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered> 
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
          <Button className="btn-secondary" onClick={() => setShowModal(false)}>취소</Button>
          <Button className="btn-primary" onClick={handleConfirmCouple}>확인</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RegisterCouple;
