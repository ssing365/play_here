import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/preference.css";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RegisterPreference = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const stateUserId = location.state?.userId;
        //이전 페이지에서 넘어온 userId 확인
        if (stateUserId) {
            setUserId(stateUserId);
        } else {
            //없을 경우 로컬 스토리지 확인
            const storedUserId = localStorage.getItem("userId"); // 키값 통일
            if (storedUserId) {
                setUserId(storedUserId);
            } else {
                alert(
                    "회원가입 정보가 없습니다. 회원가입 페이지로 돌아갑니다."
                );
                navigate("/register-terms");
                return;
            }
        }

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

        // 🔹 필수 카테고리 목록 가져오기
        const requiredCategories = categories.map(category => category.title);

        // 🔹 각 필수 카테고리에서 적어도 하나 이상의 아이템이 선택되었는지 확인
        const missingCategories = requiredCategories.filter(title => 
            !selected[title] || selected[title].length === 0
        );

        if (missingCategories.length > 0) {
            Swal.fire({
                text: `다음 카테고리에서 최소 하나 이상 선택해주세요: ${missingCategories.join(", ")}`,
                timer: 2000,
                confirmButtonColor: "#e91e63",
            });
            return;
        }

        //선택된 선호도 ID들을 배열로 변환하기
        const selectedPreferences = Object.values(selected).flat();
        // if (selectedPreferences.length === 0) {
        //     Swal.fire({
        //         text: "최소 한 개 이상의 선호도를 선택해주세요!",
        //         timer: 1500,
        //         confirmButtonColor: "#e91e63",
        //     });
        //     return;
        // }

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
                // Swal이 완료된 후 페이지 이동
                Swal.fire({
                    title: "선호도 정보가 저장되었습니다.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    navigate("/register-complete");
                });
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
            <div className="container mt-5">
                <div className="d-flex mt-5 ">
                    <h4 style={{ fontWeight: "bold" }}>
                        💕 회원님의 선호도를 기반으로 데이트 장소를 추천해
                        드려요😊
                    </h4>
                </div>
                <div className="text-muted mb-5">
                    🌟선호도는 <strong>카테고리 당 1개 이상</strong> 선택해주세요
                    <br />
                    🌟선호도는 추후 마이페이지에서 수정 가능합니다:)
                </div>
                <div className="row">
                    <div className="col-12 col-lg-6">
                        {categories
                            .filter((category) =>
                                ["먹기", "마시기", "놀기"].includes(
                                    category.title
                                )
                            )
                            .map((category) => (
                                <div
                                    key={category.title}
                                    className="category-section"
                                >
                                    <h5 className="category-title">
                                        {category.title} 
                                    </h5>
                                    <span className="text-danger">
                                    * 최소 1개 이상 선택 </span>
                                    <div className="d-flex flex-wrap">
                                        {category.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="d-flex flex-column align-items-center"
                                            >
                                                <div
                                                    className={`icon-circle ${
                                                        selected[
                                                            category.title
                                                        ]?.includes(item.id)
                                                            ? "selected"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleClick(
                                                            category.title,
                                                            item
                                                        )
                                                    }
                                                >
                                                    {item.icon}
                                                </div>
                                                <span className="label">
                                                    {item.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="col-12 col-lg-6">
                        {categories
                            .filter((category) =>
                                ["보기", "걷기"].includes(category.title)
                            )
                            .map((category) => (
                                <div
                                    key={category.title}
                                    className="category-section"
                                >
                                    <h5 className="category-title">
                                        {category.title}
                                    </h5>
                                    <span className="text-danger">
                                    * 최소 1개 이상 선택 </span>
                                    <div className="d-flex flex-wrap">
                                        {category.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="d-flex flex-column align-items-center"
                                            >
                                                <div
                                                    className={`icon-circle ${
                                                        selected[
                                                            category.title
                                                        ]?.includes(item.id)
                                                            ? "selected"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleClick(
                                                            category.title,
                                                            item
                                                        )
                                                    }
                                                >
                                                    {item.icon}
                                                </div>
                                                <span className="label">
                                                    {item.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        <div className="text-center mt-3">
                            <button
                                className="preference-btn"
                                onClick={handleSubmit}
                            >
                                선택완료
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPreference;