import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import Swal from "sweetalert2";

const MemberWithdrawal = () => {
    // context에서 로그인 상태, 유저 정보 가져오기
    const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
    const continueOn = () => {
        return Swal.fire({
            title: "여기놀자를 탈퇴하시겠어요?",
            text: "탈퇴한 계정은 되돌릴 수 없습니다.",
            icon: "warning",

            showCancelButton: true,
            confirmButtonColor: "#e91e63",
            cancelButtonColor: "#666",
            confirmButtonText: "네",
            cancelButtonText: "취소",

            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                return Swal.fire({
                    title: "정말 탈퇴하시겠습니까?",
                    icon: "warning",

                    showCancelButton: true,
                    confirmButtonColor: "#e91e63",
                    cancelButtonColor: "#666",
                    confirmButtonText: "탈퇴",
                    cancelButtonText: "취소",
                }).then((finalResult) => {
                    if (finalResult.isConfirmed) {
                        return true; // 최종 확인됨
                    }
                    return false; // 취소됨
                });
            }
            return false; // 첫 번째 confirm에서 취소됨
        });
    };

    const handleWithdrawal = async () => {
        const confirmed = await continueOn();
        if (confirmed) {
            {
                try {
                    const response = await axios.put(
                        "http://localhost:8586/api/user/withdraw",
                        {},
                        { withCredentials: true }
                    );
                    setIsLoggedIn(false);
                    localStorage.removeItem("savedUserId");
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
            <button
                className="btn btn-outline-danger quit-btn"
                onClick={handleWithdrawal}
            >
                회원 탈퇴
            </button>
        </div>
    );
};

export default MemberWithdrawal;
