import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import "../css/MyPage.css"; // CSS 파일 import
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const MyPage = () => {
    const [userInfo, setUserInfo] = useState(null); // 로그인 유저 정보
    const remoteIp = import.meta.env.VITE_REMOTE_IP;
    const port = import.meta.env.VITE_PORT;

    // 로그인 상태 확인 및 정보 추출
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // 쿠키를 포함하기 위해 withCredentials 옵션 사용
                const response = await axios.get(
                    "http://localhost:8586/api/user-info",
                    { withCredentials: true }
                );
                console.log("사용자 정보 @ mypage:", response.data);
                setUserInfo(response.data);
            } catch (error) {
                console.error("사용자 정보 가져오기 오류:", error);
            }
        };
        fetchUserInfo();
    }, []);

    return (
        <>
            <TopBar />
            <div className="mypage-container">
                {/* 메인 카드 */}
                <div className="mypage-card">
                    {/* 프로필 섹션 */}
                    <div className="profile-section">
                        {userInfo?.profilePicture ? (
                            <img
                                src={`http://${remoteIp}:${port}/image/${userInfo.profilePicture}` }
                                alt="프로필 사진"
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                }}
                            />
                        ) : (
                            <FaUserCircle className="profile-icon" />
                        )}
                        <h2 className="nickname">
                            {userInfo?.nickname || "Loading..."}
                        </h2>
                        <Link to={"/editprofile"}>
                            <button className="edit-btn">정보수정</button>
                        </Link>
                    </div>

                    {userInfo && (
                        <div className="profile-info">
                            📧: {userInfo.email} <br />
                            🎁: {userInfo.birthDate} <br />
                            🏡: {userInfo.address} <br />
                        </div>
                    )}

                    <hr className="divider" />

                    {/* 커플 연결하기 버튼 or 캘린더 이동 */}
                    {userInfo && (
                        <>
                            {userInfo.coupleStatus === 0 ? (
                                <Link to="/connect-couple">
                                    <button className="couple-btn">
                                        💛 커플 연결하기 💛
                                    </button>
                                </Link>
                            ) : userInfo.coupleStatus === 1 ? (
                                <Link to="/calender">
                                    <button className="couple-btn">
                                        커플 캘린더 이동하기
                                    </button>
                                </Link>
                            ) : null}
                        </>
                    )}
                    {/* 하단 메뉴 버튼 */}
                    <div className="menu-buttons">
                        <Link to={"/editpreference"} className="menu-btn">
                            <button>선호도 수정</button>
                        </Link>
                        <Link to={"/mypagelikes"} className="menu-btn">
                            <button>좋아요 리스트</button>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyPage;
