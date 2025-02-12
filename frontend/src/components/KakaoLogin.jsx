import { useEffect } from "react"
import KakaoLogin from "react-kakao-login"
import axios from "axios";

const KakaoLoginButton = () => {

    const kakaoClientId = "3b01976fc8b8677fcef51a567b2ea174"; // js키

    const kakaoOnSuccess = async (data) => {
        console.log(data);
        const idToken = data.response.access_token;

        try {
            const response = await axios.post("http://localhost:8586/api/kakao-login", {
                accessToken: idToken
            }, { withCredentials: true }); // ✅ 쿠키 전달을 위한 옵션

            console.log("서버 응답:", response.data);
            alert("카카오로 로그인 되었습니다");
            window.location.href = '/';
        } catch (error) {
            console.error("백엔드 요청 실패:", error);
        }
    };
    
    const kakaoOnFailure = (error) => {
        console.log("카카오 로그인 실패:", error);
    };

    return(
        <>
            <KakaoLogin
                token={kakaoClientId}
                onSuccess={kakaoOnSuccess}
                onFail={kakaoOnFailure}
            />
        </>
    );
}

export default KakaoLoginButton;