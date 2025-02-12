import { useEffect } from "react"
import KakaoLogin from "react-kakao-login"

const KakaoLoginButton = () => {

    const kakaoClientId = "3b01976fc8b8677fcef51a567b2ea174"

    const handleLogin = () => {
        window.Kakao.Auth.authorize({
            redirectUri: 'http://localhost:5173/oauth/callback/kakao', // 카카오 설정과 동일해야 함
        });
    };

    const kakaoOnSuccess = async (data)=>{
        console.log(data)
        const idToken = data.response.access_token  // 엑세스 토큰 백엔드로 전달
        console.log(idToken);
    }
    const kakaoOnFailure = (error) => {
        console.log(error);
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