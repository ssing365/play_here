import TopBar from "../components/TopBar";
import "../css/MyPage.css"; // CSS 파일 import
import { FaUserCircle } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

const EditProfile = () => {
    const handleAddressClick = () => {
        // 외부 주소 API 창 열기 (예: 카카오 주소 API)
        alert("주소 입력 창이 열립니다."); // 실제 API로 대체
    };
    
    return (
        <>
            <TopBar />
            <div className="mypage-container">
                <div className="edit-mypage-card ">
                        <div className="profile-section d-flex justify-content-center">
                            <label htmlFor="profile-upload">
                                <FaUserCircle className="edit-profile-icon" style={{ cursor: 'pointer' }} />
                            </label>
                            <input id="profile-upload" type="file" style={{ display: 'none' }} />
                        </div>

                        <div className= "w-100 d-flex justify-content-center mt-3">
                            <div className="me-4 text-end">
                                <label className="d-block mb-4">닉네임</label>
                                <label className="d-block mb-4">이메일</label>
                                <label className="d-block mb-4">생년월일</label>
                                <label className="d-block mb-4">주소</label>
                            </div>

                            <div>
                                <input className="form-control mb-2" type="text" defaultValue="홍길동이" />
                                <input className="form-control mb-2" type="email" defaultValue="ssing365@naver.com" />
                                <input className="form-control mb-2" type="date" defaultValue="1998-11-30" />
                                <input 
                                    className="form-control mb-2" 
                                    type="text" 
                                    defaultValue="경기도 광명시 도덕로 56" 
                                    onClick={handleAddressClick} 
                                    readOnly
                                    style={{ cursor: 'pointer' }} 
                                />
                            </div>
                        </div>
                        
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-secondary my-4">비밀번호 변경</button>
                            <button className="btn btn-success my-4 ms-auto">저장</button>
                        </div>
                        <br />

                        <hr className="divider" />
                        <button className="btn btn-danger my-2">커플 끊기</button>

                        <hr className="divider" />
                        <button className="btn btn-outline-danger ">회원 탈퇴</button>
                </div>
            </div>
        </>
    );
};

export default EditProfile;
