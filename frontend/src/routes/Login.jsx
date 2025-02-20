import { useContext, useEffect, useRef, useState } from "react";
// import Container_ from 'postcss/lib/container';
import TopBar from "../components/TopBar";
import "../css/LogForm.scss";
import KakaoLoginButton from "../components/Login/KakaoLogin.jsx"
import NaverLoginButton from "../components/Login/NaverLogin.jsx"
import { Link, useLocation, useNavigate, } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../contexts/UserContext"; //UserContext 추가 
import Swal from "sweetalert2";

const Login = () => {
    const remoteIp = import.meta.env.VITE_REMOTE_IP;
    const port = import.meta.env.VITE_PORT;

    const idRef = useRef(null);
    const passwordRef = useRef(null);
    const rememberMeRef = useRef(null);
    const navigate = useNavigate();  
    const location = useLocation(); 


    const { isLoggedIn, setIsLoggedIn, setUserInfo } = useContext(UserContext); //로그인 상태 업데이트 함수 가져오기

    const [isLoggingIn, setIsLoggingIn] = useState(false); // 로그인 진행 중 여부

    // URL에서 리디렉트할 경로 확인
    const params = new URLSearchParams(location.search);
    const redirectTo = params.get("redirect") || "/"; // 없으면 기본 페이지로 이동

    //  1. 로그인 상태라면 로그인 페이지 접근 금지!
    useEffect(() => {
        if (isLoggedIn) {
            navigate(redirectTo, { replace: true }); // 로그인 상태면 자동으로 이동
        }
    }, [isLoggedIn, navigate, redirectTo]);

    // 2. 페이지 로드 시 localStorage에서 아이디 불러오기
    useEffect(() => {
        const savedId = localStorage.getItem("savedUserId");
        if (savedId) {
            idRef.current.value = savedId;
            rememberMeRef.current.checked = true; // 체크박스 자동 체크
        }
    }, []);

    // ✅ 3. 로그인 처리 및 아이디 저장
    const formValidate = async (e) => {
        e.preventDefault();
        if (isLoggingIn) return; //로그인 진행 중이면 중복 요청 방지

        const userId = idRef.current.value;
        const password = passwordRef.current.value;
        const rememberMe = rememberMeRef.current.checked;

        if (userId === '') {
            alert("아이디를 입력해주세요.");
            idRef.current.focus();
            return;
        }

        if (password === '') {
            alert("비밀번호를 입력해주세요.");
            passwordRef.current.focus();
            return;
        }

        setIsLoggingIn(true);


        try {
            const response = await axios.post(
                '/api/login',
                { userId, password },
                { withCredentials: true }
            );

            if (response.data === 'success') {
                alert('로그인 성공!');

                //UserContext 업데이트 
                setIsLoggingIn(true);

                // 로그인한 사용자 정보 가져오기
                const userResponse = await axios.get("http://localhost:8586/api/user-info", { withCredentials: true });
                setUserInfo(userResponse.data);
                
                // ✅ 3. 아이디 저장 또는 삭제
                if (rememberMe) {
                    localStorage.setItem("savedUserId", userId); // 아이디 저장
                } else {
                    localStorage.removeItem("savedUserId"); // 저장된 아이디 삭제
                }

                // window.location.href = '/';
                // 로그인 상태가 반영될 시간을 주고 이동 (setTimeout 사용)
                setTimeout(() => {
                    navigate(redirectTo, { replace: true });
                }, 100);                
            } 

        } catch (error) {
            setIsLoggingIn(false); // 로그인 실패 시 다시 로그인 가능하게 변경
            if (error.response && error.response.status === 401) {
                Swal.fire({
                    icon: "warning",
                    text: "아이디 또는 비밀번호가 올바르지 않습니다.",
                    timer: 1000,
                    showConfirmButton: false,
                });
            } else {
                console.error("로그인 오류:", error);
                alert("서버 오류가 발생했습니다.");
            }
        }
    };

    return (
        <>
            <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>

            <TopBar />
            <div className="loginContainer">
                <h3 className="loginTitle">로그인</h3>
                <b className="loginMessage">
                    여기놀자에서 특별한 하루를 만들어 보세요
                </b>

                <form
                    action=""
                    method="post"
                    className="loginForm"
                    onSubmit={formValidate}
                >
                    <div className="first-input input__block first-input__block">
                        <input
                            placeholder="아이디"
                            className="input"
                            required
                            ref={idRef}
                        />
                    </div>
                    <div className="input__block">
                        <input
                            type="password"
                            placeholder="비밀번호"
                            className="input"
                            required
                            ref={passwordRef}
                        />
                    </div>
                    <div className="remember">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            ref={rememberMeRef}
                        />
                        <label
                            htmlFor="rememberMe"
                            style={{ marginLeft: "8px" }}
                        >
                            아이디 저장
                        </label>
                    </div>
                    <input
                        type="submit"
                        className="signin__btn"
                        value="로그인"
                    />
                </form>

                <div className="find-me">
                    <span
                        className="find-id"
                        onClick={() => navigate("/find-id")}
                    >
                        아이디 찾기
                    </span>
                    /
                    <span
                        className="find-pwd"
                        onClick={() => navigate("/find-pwd")}
                    >
                        비밀번호 찾기
                    </span>
                </div>

                <Link to={"/register-terms"}>
                    <span className="regist">회원가입</span>
                </Link>

                <div className="separator">
                    <p>OR</p>
                </div>

                <div className="kakao__btn">
                    <KakaoLoginButton />
                </div>
                <div className="naver__btn">
                    <NaverLoginButton />
                </div>
            </div>
        </>
    );
};

export default Login;
