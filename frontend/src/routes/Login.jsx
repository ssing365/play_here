import { useEffect, useRef, useState } from "react";
// import Container_ from 'postcss/lib/container';
import TopBar from "../components/TopBar";
import "../css/LogForm.scss";
import KakaoLoginButton from "../components/Login/KakaoLogin.jsx";
import NaverLoginButton from "../components/Login/NaverLogin.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";
import FindIdModal from "../components/Login/FindIdModal.jsx";

const Login = () => {
    const remoteIp = import.meta.env.VITE_REMOTE_IP;
    const port = import.meta.env.VITE_PORT;

    const idRef = useRef(null);
    const passwordRef = useRef(null);
    const rememberMeRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const modalRef = useRef(null); // 모달 참조 추가


    // ✅ 1. 페이지 로드 시 localStorage에서 아이디 불러오기
    useEffect(() => {
        const savedId = localStorage.getItem("savedUserId");
        if (savedId) {
            idRef.current.value = savedId;
            rememberMeRef.current.checked = true; // 체크박스 자동 체크
        }
    }, []);

    // ✅ 2. 로그인 처리 및 아이디 저장
    const formValidate = async (e) => {
        e.preventDefault();
        const userId = idRef.current.value;
        const password = passwordRef.current.value;
        const rememberMe = rememberMeRef.current.checked;

        try {
            const response = await axios.post(
                "/api/login",
                { userId, password },
                { withCredentials: true }
            );
            console.log(response);
            console.log(response.data);

            if (response.status === 200) {
                // ✅ 1. `couple_status == 2`이면 알림 띄우고 확인 후 이동!
                if (response.data.message && response.data.message.trim() !== "") {
                    Swal.fire({
                        icon: "warning",
                        title: response.data.message, 
                        text: "커플 캘린더와 커플 일기가 모두 삭제되어 접근하실 수 없습니다.",
                        confirmButtonText: "확인",
                    }).then(() => {
                        // ✅ 확인 버튼을 누른 후에만 이동하도록 변경!
                        const redirectPath = new URLSearchParams(location.search).get("redirect");
                        window.location.href = redirectPath ? redirectPath : "/";
                    });
                } else {
                    // ✅ 메시지가 없으면 바로 이동
                    const redirectPath = new URLSearchParams(location.search).get("redirect");
                    window.location.href = redirectPath ? redirectPath : "/";
                }
    
                // ✅ 2. 아이디 저장 또는 삭제
                if (rememberMe) {
                    localStorage.setItem("savedUserId", userId);
                } else {
                    localStorage.removeItem("savedUserId");
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                Swal.fire({
                    icon: "warning",
                    text: "아이디 또는 비밀번호가 올바르지 않습니다.",
                    timer: 1000,
                    showConfirmButton: false,
                });
            }else if (error.response && error.response.status === 403) {
                Swal.fire({
                    icon: "error",
                    text: "이 계정은 탈퇴한 회원입니다. 로그인할 수 없습니다.",
                    showConfirmButton: true,
                });
            } else {
                console.error("로그인 오류:", error);
                alert("서버 오류가 발생했습니다.");
            }
        }
    };

    // ✅ 모달 트리거 함수
    const handleShowModal = () => {
        if (modalRef.current) {
            const modalInstance = new Modal(modalRef.current);
            modalInstance.show();
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
                    <span className="find-id" onClick={handleShowModal}>
                        아이디 찾기
                    </span>
                    /
                    <span
                        className="find-pwd"
                        onClick={(e) => {
                            e.preventDefault();
                            alert("구현중인 기능입니다.");
                        }}
                    >
                        비밀번호 찾기
                    </span>
                </div>

                {/* 아이디 찾기 모달 */}
                <FindIdModal modalRef={modalRef} />

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
