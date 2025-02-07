import  { useState } from 'react';
import { Link } from 'react-router-dom';
// import Container_ from 'postcss/lib/container';
import Navbar from '../components/Navbar';
import './LogForm.css';
import kkt from '../images/kakao_login_medium_narrow.png'
import naver from '../images/btnG_완성형.png'
import ggl from '../images/ggl_icon.png'
const Login = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('로그인 시도:', loginData);
  };

  return (
    <div className="login-container">
    <Navbar/>

      <h2 className="login-title">로그인</h2>
      <p className="login-subtitle">특별한 하루를 만들어보세요.</p>
      <hr style={{margin:'20px'}}/>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          name="username"
          placeholder="아이디"
          value={loginData.username}
          onChange={handleChange}
          className="login-input"
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={loginData.password}
          onChange={handleChange}
          className="login-input"
        />
        
        <button type="submit" className="login-button">
          로그인
        </button>
      <label >
        <input type="checkbox" /> 로그인 상태 유지하기
      </label>
        <div className="signup-link">
          <a href="#" style={{color:'violet'}}>비밀번호를 잊으셨나요?</a> <br />
          
           <a href="Regist">계정이 없으신가요?</a>
          
        </div>

        <div className="social-login">
          
          <button 
            type="button"
            
            className="social-button naver" >
            <img src={naver} style={{ width:'45px',height:'45px'}}className='social-button naver'
            />
            네이버로 로그인
          </button>
          
          <button 
            type="button"
            className="social-button kakao"  >
            <img src={kkt} style={{ width:'45px',height:'45px', position: 'relative',
              
            }}
          className='icons'/>
            카카오로 로그인
          </button>
          <button 
            type="button"
            className="social-button google">
              <img src={ggl} style={{ width:'50px',height:'49px', 
                }}
          className='icons'/>
            구글로 로그인
          </button>
          
         <script >
           function validate(){

           }
         </script>
          
        </div>
      </form>
      
        
       
    
    </div>
  );
};

export default Login;