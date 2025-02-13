import TopBar from "../components/TopBar";
import Footer from "../components/Footer"
import "../css/MyPage.css"; // CSS 파일 import
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const MyPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <TopBar />
            <div className="mypage-container">
                {/* 메인 카드 */}
                <div className="mypage-card">
                    {/* 프로필 섹션 */}
                    <div className="profile-section">
                        <FaUserCircle className="profile-icon" />
                        <h2 className="nickname">홍길동이</h2>
                        <Link to={"/editprofile"}>
                            <button className="edit-btn">정보수정</button>
                        </Link>
                    </div>

                    <div className="profile-info">
                        📧: ssing365@naver.com <br />
                        🎁: 1998. 11. 30 <br />
                        🏡: 경기도 광명시 도덕로 56 <br />
                    </div>

                    <hr className="divider" />

                    {/* 커플 연결하기 버튼 */}
                    <Link to="/connect-couple">
                        <button className="couple-btn">
                            💛 커플 연결하기 💛
                        </button>
                    </Link>

                    {/* 하단 메뉴 버튼 */}
                    <div className="menu-buttons">
                        <Link to={"/preference"} className="menu-btn">
                            <button >선호도 수정</button>
                        </Link>
                        <Link to={"/mypagelikes"} className="menu-btn">
                            <button >좋아요 리스트</button>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default MyPage;
