import { useState } from "react";
// import Container_ from 'postcss/lib/container';
import TopBar from "../components/TopBar";
import "../css/LogForm.scss";
const Login = () => {
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    return (
        <>
            <TopBar />
            <div className="loginContainer">
                
                <h3 className="loginTitle">로그인</h3>
                <b className="loginMessage">여기놀자에서 특별한 하루를 만들어 보세요</b>

                <form action="" method="post" className="loginForm">
                    <div className="first-input input__block first-input__block">
                        <input
                            type="email"
                            placeholder="아이디"
                            className="input"
                            id="email"
                        />
                    </div>
                    <div className="input__block">
                        <input
                            type="password"
                            placeholder="비밀번호"
                            className="input"
                            id="password"
                        />
                    </div>
                    <div className="input__block">
                        <input
                            type="password"
                            placeholder="Repeat password"
                            className="input repeat__password"
                            id="repeat__password"
                        />
                    </div>
                    <button className="signin__btn">로그인</button>
                </form>

                <div className="separator">
                    <p>OR</p>
                </div>

                <button className="kakao__btn">
                  <img src="/images/btn_kakao.svg" alt="네이버" />
                    카카오로 로그인하기
                </button>
                <button className="naver__btn">
                    <img src="/images/btn_naver.svg" alt="네이버" />
                    네이버로 로그인하기
                </button>
            </div>
        </>
    );
};

export default Login;
