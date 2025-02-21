import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import "../css/MyPage.css"; // CSS 파일 import
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Button } from "react-bootstrap";

const MyPage = () => {
    const remoteIp = import.meta.env.VITE_REMOTE_IP;
    const port = import.meta.env.VITE_PORT;

    // context에서 로그인 유저 정보 가져오기
    const { userInfo } = useContext(UserContext);
    //렌더링되고 coupleStatus
    console.log(userInfo?.coupleStatus);

    return (
        <>
            <TopBar />
            <div className="mypage-container">
                {/* 메인 카드 */}
                <div className="mypage-card">
                    {/* 프로필 섹션 */}
                    <div className="profile-section d-flex justify-content-center">
                        {userInfo?.profilePicture ? (
                            <img
                                src={`http://${remoteIp}:${port}/image/${userInfo.profilePicture}`}
                                alt="프로필 사진"
                                style={{
                                    width: "200px",
                                    height: "200px",
                                    borderRadius: "50%",
                                }}
                            />
                        ) : (
                            <FaUserCircle
                                className="profile-icon"
                                style={{
                                    width: "200px",
                                    height: "200px",
                                }}
                            />
                        )}
                    </div>
                    <h2 className="nickname">
                        {userInfo?.nickname || "Loading..."}
                    </h2>

                    <div className="profile-container">
                        {userInfo && (
                            <div className="profile-info">
                                📧: {userInfo.email} <br />
                                🎁: {userInfo.birthDate?(userInfo.birthDate):("정보를 입력해주세요 👉")} <br />
                                🏡: {userInfo.address?(userInfo.address):("정보를 입력해주세요 👉")} <br />
                            </div>
                        )}
                        <Link to={"/editprofile"}>
                            <Button
                                variant="outline-secondary"
                                className="edit-button"
                            >
                                정보수정
                            </Button>
                        </Link>
                    </div>

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
                                <Link to="/calendar">
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
