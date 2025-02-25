import axios from "axios";
import { useContext } from "react";
import Swal from "sweetalert2";
import {UserContext} from "../../contexts/UserContext";

const CoupleDisconnect = () => {
    const { userInfo } = useContext(UserContext); //userId 가져오기
    const continueOn = () => {
        return Swal.fire({
            title: "커플 캘린더와 일기가 전부 삭제됩니다. 그래도 끊으시겠습니까?",
            text: "다시 되돌릴 수 없습니다. 신중하세요.",
            icon: "warning",

            showCancelButton: true,
            confirmButtonColor: "#e91e63",
            cancelButtonColor: "#666",
            confirmButtonText: "끊기",
            cancelButtonText: "취소",

            reverseButtons: true, 
        }).then((result) => {
            if (result.isConfirmed) {
                return Swal.fire({
                    title: "정말 끊으시겠습니까?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#e91e63",
                    cancelButtonColor: "#666",
                    confirmButtonText: "끊기",
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

    const handleDisconnect = async () => {
        const confirmed = await continueOn();
        if (confirmed) {
            try {
                console.log("🚀 [프론트] 커플 끊기 요청 보냄!"); // 디버깅 코드 추가
                const response = await axios.put(
                    "/api/couple/disconnect",
                    {},
                    { withCredentials: true }
                );
                console.log("✅ [프론트] 응답 받음: ", response.data); // 응답 확인
                Swal.fire({
                    icon: "success",
                    title: "커플 해제 완료!",
                    text: response.data.message,  // 🔥 응답 메시지 출력!
                    confirmButtonText: "확인",
                }).then(() => {
                    // ✅ 확인 버튼 클릭 후 마이페이지로 이동
                    window.location.href = "/mypage";
                });
            } catch (error) {
                console.error("커플 끊기 실패:", error);
                console.error("❌ [프론트] 커플 끊기 실패:", error.response ? error.response.data : error.message);
                Swal.fire({
                    icon: "error",
                    title: "커플 끊기 실패!",
                    text: "커플 끊기에 실패했습니다. 다시 시도해주세요.",
                    confirmButtonText: "확인",
                });
            }
        }
    };


    return (
        <div className="quit-button-container">
            <button
                className="btn btn-danger my-2 disconnection"
                onClick={handleDisconnect}
            >
                커플 끊기
            </button>
        </div>
    );
};

export default CoupleDisconnect;
