import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CoupleDisconnect = () => {
  const navigate = useNavigate();

  const handleDisconnect = async () => {
    if (window.confirm("커플 캘린더와 일기가 다 사라집니다. 그래도 끊으시겠습니까?")) {
      if (window.confirm("정말 끊으시겠습니까?")) {
        try {
          const response = await axios.put(
            "http://localhost:8586/api/couple/disconnect",
            {},
            { withCredentials: true }
          );
          alert(response.data);
          // API 호출 후 mypage로 이동 및 새로고침
          window.location.href = "/mypage";
        } catch (error) {
          console.error("커플 끊기 실패:", error);
          alert("커플 끊기에 실패했습니다.");
        }
      }
    }
  };

  return (
    <div className="quit-button-container">
      <button className="btn btn-danger my-2 disconnection" onClick={handleDisconnect}>
        커플 끊기
      </button>
    </div>
  );
};

export default CoupleDisconnect;
