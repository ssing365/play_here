import axios from 'axios';
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const MemberWithdrawal = () => {
  const navigate = useNavigate();
      // context에서 로그인 상태, 유저 정보 가져오기
      const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

  const handleWithdrawal = async () => {
    if (window.confirm("탈퇴한 계정은 되돌릴 수 없습니다. 그래도 탈퇴하시겠습니까?")) {
        if(window.confirm("정말 탈퇴하시겠습니까?")){
            try {
                const response = await axios.put(
                  "http://localhost:8586/api/user/withdraw",
                  {},
                  { withCredentials: true }
                );
                setIsLoggedIn(false);
                alert(response.data);
                window.location.href = "/";
              } catch (error) {
                console.error("회원 탈퇴 실패:", error);
                alert("회원 탈퇴에 실패했습니다.");
              }
        }
    }
  };

  return (
    <div className="quit-button-container">
      <button className="btn btn-outline-danger quit-btn" onClick={handleWithdrawal}>
        회원 탈퇴
      </button>
    </div>
  );
};

export default MemberWithdrawal;
