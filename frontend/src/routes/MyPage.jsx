import { FaUserCircle } from "react-icons/fa";
import "./css/MyPage.css"; // CSS 파일 import
import NavBar from "../components/Navbar";
import { Link } from "react-router-dom";

const MyPage = () => {
    return (
        <>
            <NavBar />
            <div className="mypage-container">
                {/* 메인 카드 */}
                <div className="mypage-card">
                    {/* 리본 */}
                    <div className="ribbon">마이페이지</div>
                    {/* 프로필 섹션 */}
                    <div className="profile-section">
                        <FaUserCircle className="profile-icon" />
                        <h2 className="nickname">닉네임</h2>
                        <button className="edit-btn">정보수정</button>
                    </div>

                    <hr className="divider" />

                    {/* 커플 연결하기 버튼 */}
                    <Link to="/connect-couple"> 
                        <button className="couple-btn">💛 커플 연결하기 💛</button>
                    </Link>

                    {/* 하단 메뉴 버튼 */}
                    <div className="menu-buttons">
                        <button className="menu-btn">선호도 수정</button>
                        <button className="menu-btn">좋아요 리스트</button>
                        <button>고객센터</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyPage;
