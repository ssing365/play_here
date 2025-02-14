import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/preference.css";
import TopBar from "../components/TopBar";
import { Link } from "react-router-dom";

const RegisterPreference = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        //JSON 파일에서 categories.json 불러오기
        fetch("/data/categories.json")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("카테고리 데이터를 불러올 수 없습니다.");
                }
                return res.json();
            })
            .then((data) => setCategories(data))
            .catch((error) => {
                console.error("카테고리 데이터 로드 실패:", error);
                alert(
                    "카테고리 데이터를 불러올 수 없습니다. 회원가입을 완료합니다."
                );
                navigate("register-complete"); //회원가입 성공 페이지로 이동
            });
    }, [location.state, navigate]); // ✅ state만 의존성으로 사용

    const [selected, setSelected] = useState({});

    const handleClick = (categoryTitle, item) => {
        setSelected((prevState) => {
            const currentCategory = prevState[categoryTitle] || [];
            if (currentCategory.includes(item.id)) {
                return {
                    ...prevState,
                    [categoryTitle]: currentCategory.filter(
                        (i) => i !== item.id
                    ),
                };
            } else {
                return {
                    ...prevState,
                    [categoryTitle]: [...currentCategory, item.id],
                };
            }
        });
    };

    const handleSubmit = async () => {
        if (!userId) {
            alert("회원 정보를 확인할 수 없습니다.");
            navigate("/register-terms");
            return;
        }

        //선택된 선호도 ID들을 배열로 변환하기
        const selectedPreferences = Object.values(selected).flat();
        if (selectedPreferences.length === 0) {
            alert("최소 하나 이상의 선호도를 선택해 주세요!");
            return;
        }

        const preferencesToSend = selectedPreferences.map((preferenceId) => ({
            userId: userId, // 각 선호도에 userId 추가
            preferenceId: preferenceId,
        }));

        try {
            const response = await fetch(
                "http://localhost:8586/join/preference.do",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(preferencesToSend), // userID : preferenceId 쌍
                }
            );

            if (!response.ok) {
                throw new Error("서버 응답이 실패했습니다.");
            }

            //서버 응답 JSON 데이터 읽기
            const result = await response.json();
            if (result.result === 1) {
                alert("선호도 정보가 저장되었습니다.");
                //회원가입 성공 페이지 이동
                navigate("/register-complete");
                //로컬스토리지에 저장된 userId 삭제하기
                localStorage.removeItem("userId");
            } else {
                alert("선호도 저장에 실패했습니다. 다시 시도해주세요");
            }
        } catch (error) {
            console.error("회원 선호도 저장 서버 요청 오류:", error);
            alert(
                "서버 오류로 선호도를 저장하지 못했습니다. 다시 시도해주세요."
            );
        }
    };

    return (
        <>
            <TopBar />

            <div className="container mt-5">
                <div className="d-flex justify-content-center mt-4">
                    <h1>회원 선호도 조사</h1>
                </div>
                <br />
                <div className="d-flex justify-content-center mt-4">
                    <h5>
                        💕선호도를 기반으로 데이트 장소를 추천해 드려요😊
                        <br />
                        🌟선호도는 1개 이상 선택해주세요
                        <br />
                    </h5>
                </div>
                <div className="row">
                    {categories.map((category) => (
                        <div
                            key={category.title}
                            className="col-12 col-lg-6 mb-4"
                        >
                            <h3>{category.title}</h3>
                            <div className="d-flex flex-wrap">
                                {category.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`icon ${
                                            selected[category.title]?.includes(
                                                item.id
                                            )
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleClick(category.title, item)
                                        }
                                    >
                                        <span className="icon-content">
                                            {item.icon}
                                            <br />
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div
                        className="col-12 col-lg-6 mb-4"
                        style={{ textAlign: "center" }}
                    >
                        <br />
                        <button
                            className="btn btn-primary mr-2"
                            onClick={handleSubmit}
                            style={{
                                fontSize: "20px",
                                padding: "10px 20px",
                                margin: "10px 0",
                                width: "200px",
                            }}
                        >
                            선택완료
                        </button>
                        <br />
                        <Link to={"/mypage"}>
                            <button
                                className="btn btn-secondary"
                                style={{
                                    fontSize: "20px",
                                    padding: "10px 20px",
                                    margin: "10px 0",
                                    width: "200px",
                                }}
                            >
                                다음에 고르기
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPreference;
