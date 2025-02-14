import TopBar from "../components/TopBar";
import "../css/MyPage.css"; // CSS 파일 import
import { FaUserCircle } from "react-icons/fa";
import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../contexts/UserContext";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
    const remoteIp = import.meta.env.VITE_REMOTE_IP;
    const port = import.meta.env.VITE_PORT;
    const navigate = useNavigate();

    // context에서 로그인 유저 정보 가져오기
    const { userInfo } = useContext(UserContext);

    //우편번호 검색 완료 후 detailAddress 포커스하기
    const detailAddressRef = useRef(null);

    useEffect(() => {
        if (!window.daum || !window.daum.Postcode) {
            const script = document.createElement("script");
            script.src =
                "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const execDaumPostcode = () => {
        new window.daum.Postcode({
            oncomplete: (data) => {
                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
                // detailAddressRef.current을 사용하여 포커스를 설정합니다.
                detailAddressRef.current.focus();
            },
        }).open();
    };

    return (
        <>
            <TopBar />
            <div className="mypage-wrapper">
                <div className="mypage-container">
                    <div className="edit-mypage-card ">
                        <div className="profile-section d-flex justify-content-center">
                            <label htmlFor="profile-upload">
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
                            </label>
                            <input
                                id="profile-upload"
                                type="file"
                                style={{ display: "none" }}
                            />
                        </div>

                        <div className="w-100 d-flex justify-content-center mt-3">
                            <div className="profile-form">
                                {/* 각 라벨과 인풋을 한 줄로 정렬 */}
                                <div className="form-group">
                                    <label>닉네임</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={userInfo.nickname}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>이메일</label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        value={userInfo.email}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>생년월일</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        value={userInfo.birthDate}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>주소</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={userInfo.address}
                                        onClick={execDaumPostcode}
                                        readOnly
                                        style={{ cursor: "pointer" }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="button-container">
                            <Button
                                variant="outline-secondary"
                            >
                                비밀번호 변경
                            </Button>
                            <div className="spacer"></div>
                            <button className="btn btn-secondary"
                                onClick={()=>navigate(-1)}>
                                cancel
                            </button>
                            <button className="btn btn-success save-btn">
                                저장
                            </button>
                        </div>

                        <hr className="divider" />
                        {userInfo.coupleStatus ? (
                            <div className="button-container">
                                <button className="btn btn-danger my-2 disconnection">
                                    커플 끊기
                                </button>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                <div className="quit-button-container">
                    <button className="btn btn-outline-danger quit-btn ">
                        회원 탈퇴
                    </button>
                </div>
            </div>
        </>
    );
};

export default EditProfile;
