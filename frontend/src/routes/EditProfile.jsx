import TopBar from "../components/TopBar";
import "../css/MyPage.css"; // CSS 파일 import
import { FaUserCircle } from "react-icons/fa";
import { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../contexts/UserContext";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CoupleDisconnect from './CoupleDisconnect'; // 커플 끊기
import MemberWithdrawal from './MemberWithdrawal'; // 회원 탈퇴

const EditProfile = () => {
    const remoteIp = import.meta.env.VITE_REMOTE_IP;
    const port = import.meta.env.VITE_PORT;
    const navigate = useNavigate();

    // context에서 로그인 유저 정보 가져오기
    const { userInfo } = useContext(UserContext);

    // profile picutre
    const [preview, setPreview] = useState(null);
    const imageSrc =
        preview ||
        (userInfo.profilePicture
            ? `http://${remoteIp}:${port}/image/${userInfo.profilePicture}`
            : null);

    // 유저 정보 편집 상태로 관리하기
    const [editedUser, setEditedUser] = useState({
        profilePicture: userInfo.profilePicture,
        nickname: userInfo.nickname,
        email: userInfo.email,
        birthDate: userInfo.birthDate,
        postcode: userInfo.zipcode,
        address: userInfo.address,
        detailAddress: userInfo.detailAddress,
    });

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        console.log("onchange:", e.target);
        const { name, value } = e.target;
        setEditedUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // profile picture
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file);
        if (file) {
             URL.revokeObjectURL(preview);
            
        }
        setEditedUser((prev) => ({ ...prev, profilePicture: file }));
        setPreview(URL.createObjectURL(file));
    };

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    // 폼 제출 핸들러: 여기서 백엔드로 수정된 정보를 전송하면 됩니다.
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("editing userInfo : ", editedUser);

        // JSON으로 변환할 데이터에서 profile_picture 제거
        const { profilePicture, ...formDataWithoutFile } = editedUser;

        // FormData 생성
        const formDataToSubmit = new FormData();

        // JSON 데이터(텍스트 정보)만 담은 객체를 문자열로 변환해서 추가
        formDataToSubmit.append("formData", JSON.stringify(formDataWithoutFile));

        // 파일이 선택되었으면 추가 (없으면 회원가입 시와 같이 생략)
        if (profilePicture) {
            formDataToSubmit.append("profile_picture", profilePicture);
        }

        try {
            // 예시로 백엔드 API에 PUT 혹은 POST 요청으로 수정 정보를 전송
            // PUT 요청으로 전송 (PUT도 FormData 전송 가능)
            const response = await axios.put(
                "http://localhost:8586/api/user-update",
                formDataToSubmit,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );
            console.log("수정 성공:", response.data);
            alert("정보 수정이 완료되었습니다.");
            window.location.href = "/mypage";
        } catch (error) {
            console.error("정보 수정 오류:", error);
            alert("정보 수정에 실패했습니다.");
        }
    };

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
                // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                var addr = ""; // 주소 변수
                var extraAddr = ""; // 참고항목 변수
                //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === "R") {
                    // 사용자가 도로명 주소를 선택했을 경우
                    addr = data.roadAddress;
                } else {
                    // 사용자가 지번 주소를 선택했을 경우(J)
                    addr = data.jibunAddress;
                }

                // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
                if (data.userSelectedType === "R") {
                    // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                    // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                    if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
                        extraAddr += data.bname;
                    }
                    // 건물명이 있고, 공동주택일 경우 추가한다.
                    if (data.buildingName !== "" && data.apartment === "Y") {
                        extraAddr +=
                            extraAddr !== ""
                                ? ", " + data.buildingName
                                : data.buildingName;
                    }
                    // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                    if (extraAddr !== "") {
                        extraAddr = " (" + extraAddr + ")";
                    }
                    // 주소변수와 참고항목 변수 합치기
                    addr += extraAddr;
                }

                //바뀐 부분
                setEditedUser((prevFormData) => ({
                    ...prevFormData,
                    postcode: data.zonecode,
                    address: addr,
                }));

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
                        <form onSubmit={handleSubmit}>
                            <div className="profile-section d-flex justify-content-center">
                                <label htmlFor="profile-upload">
                                    {imageSrc ? (
                                        <img
                                            src={imageSrc}
                                            alt="프로필 사진"
                                            style={{
                                                width: "200px",
                                                height: "200px",
                                                borderRadius: "50%",
                                                cursor: "pointer",
                                            }}
                                            name="profilePicture"
                                        />
                                    ) : (
                                        <FaUserCircle
                                            className="profile-icon"
                                            style={{
                                                width: "200px",
                                                height: "200px",
                                                borderRadius: "50%",
                                                cursor: "pointer",
                                            }}
                                        />
                                    )}
                                </label>
                                <input
                                    id="profile-upload"
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="d-flex justify-content-center text-muted">
                                * 사진을 클릭하면 파일 탐색기가 열립니다.
                            </div>
                            <div className="w-100 d-flex justify-content-center mt-3">
                                <div className="profile-form">
                                    {/* 각 라벨과 인풋을 한 줄로 정렬 */}
                                    <div className="form-group">
                                        <label>닉네임</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="nickname"
                                            value={editedUser.nickname}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>이메일</label>
                                        <input
                                            className="form-control"
                                            type="email"
                                            name="email"
                                            value={editedUser.email}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>생년월일</label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            name="birthDate"
                                            value={editedUser.birthDate}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* 우편번호 입력 */}
                                    <Form.Group
                                        controlId="formPostcode"
                                        className="mb-3 d-none"
                                    >
                                        <Form.Label>우편번호</Form.Label>
                                        <div className="d-flex">
                                            <Form.Control
                                                type="text"
                                                placeholder="우편번호"
                                                name="postcode"
                                                value={editedUser.postcode}
                                                readOnly
                                                style={{ flex: "1 1 auto" }}
                                            />
                                            {/* 아이디 중복확인 버튼*/}
                                            <Button
                                                variant="outline-secondary"
                                                className="ms-2"
                                                onClick={execDaumPostcode}
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                우편번호 찾기
                                            </Button>
                                        </div>
                                    </Form.Group>

                                    {/* 주소입력 */}
                                    <div className="form-group">
                                        <label>주소</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="주소"
                                            name="address"
                                            value={editedUser.address}
                                            readOnly
                                            onClick={execDaumPostcode}
                                        />
                                    </div>

                                    {/* 상세주소 입력창 */}
                                    <div className="form-group">
                                        <label>상세주소</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="상세주소"
                                            name="detailAddress"
                                            value={editedUser.detailAddress}
                                            onChange={handleChange}
                                            ref={detailAddressRef}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="button-container">
                                <Button variant="outline-secondary">
                                    비밀번호 변경
                                </Button>
                                <div className="spacer"></div>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate(-1)}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-success save-btn"
                                >
                                    저장
                                </button>
                            </div>
                        </form>
                        <hr className="divider" />
                        {userInfo.coupleStatus ? (
                            <CoupleDisconnect />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                <MemberWithdrawal />
            </div>
        </>
    );
};

export default EditProfile;
