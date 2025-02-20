import {useEffect} from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const NaverLoginButton = () => {
  const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID; // 발급받은 클라이언트 아이디
  const REDIRECT_URI = "http://localhost:5173/oauth/callback/naver"; // Callback URL
  const STATE = "false";
  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;

  const NaverLogin = () => {
    window.location.href = NAVER_AUTH_URL;
  };

  return (
    <>
      <button onClick={NaverLogin}
            style={{width:'100%', fontSize:'17px'}}>
        네이버 로그인
      </button>
    </>
  );
};

export const NaverCallback = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    const sendCodeToBackend = async () => {
      if (!code) return;

      try {
        const response = await axios.post("http://localhost:8586/api/naver-login"
        , { code } , { withCredentials: true });
        console.log("로그인 성공:", response.data);
        alert("네이버 로그인 성공!");
        window.location.href = '/';
        
      } catch (error) {
        console.error("네이버 로그인 실패:", error);
        alert("로그인 실패!");
      }
    };

    sendCodeToBackend();
  }, [code]);

  return <div>로그인 중...</div>;
};

export default NaverLoginButton;