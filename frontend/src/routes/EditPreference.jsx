import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/preference.css";
import TopBar from "../components/TopBar";
import Swal from "sweetalert2";
import axios from "axios";

const EditPreference = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userInfo } = useContext(UserContext);
    const [categories, setCategories] = useState([]);
    // 최종 selected state: { "먹기": [3, 15, ...], "마시기": [8,9,...], ... }
    const [selected, setSelected] = useState({});
    // 백엔드에서 받은 원본 단순 id 배열
    const [rawSelected, setRawSelected] = useState([]);

    //JSON 파일에서 categories.json 불러오기
    useEffect(() => {
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
                alert("카테고리 데이터를 불러올 수 없습니다.");
                navigate("/mypage");
            });
    }, [navigate]); // ✅ state만 의존성으로 사용

    // 현재 사용자의 선호도 불러오기
    useEffect(() => {
        if (userInfo?.userId) {
            axios
                .get(
                    `http://localhost:8586/api/user/${userInfo.userId}/preferences`
                )
                .then((response) => {
                    setRawSelected(response.data); // response.data: 선호도 id 배열
                    console.log("rawSelected:", response.data);
                })
                .catch((error) => {
                    console.error("현재 선호도 로드 실패:", error);
                    alert(
                        "선호도를 불러오는데 실패했습니다. 다시 시도해주세요"
                    );
                });
        }
    }, [location.state, userInfo?.userId]);

    // categories와 rawSelected이 모두 로드된 후, rawSelected을 selected 객체로 변환
    useEffect(() => {
        if (categories.length > 0 && rawSelected.length > 0) {
            // id → 카테고리 title 매핑 생성
            const idToCategory = {};
            categories.forEach((category) => {
                // categories.json의 구조에 따라 category.items 존재
                category.items.forEach((item) => {
                    idToCategory[item.id] = category.title;
                });
            });
            // 변환: 각 id가 속한 카테고리별로 그룹화
            const transformedSelected = {};
            rawSelected.forEach((id) => {
                const catTitle = idToCategory[id];
                if (catTitle) {
                    if (transformedSelected[catTitle]) {
                        transformedSelected[catTitle].push(id);
                    } else {
                        transformedSelected[catTitle] = [id];
                    }
                }
            });
            setSelected(transformedSelected);
        }
    }, [categories, rawSelected]);

    // 아이콘 클릭 시, 선택 토글
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
            userId: userInfo?.userId, // 각 선호도에 userId 추가
            preferenceId: preferenceId,
        }));

        try {
            const response = await fetch(
                `http://localhost:8586/api/user/${userInfo?.userId}/preferences`,
                {
                    method: "PUT",
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
                    title: "선호도 정보가 수정되었습니다.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    navigate("/mypage");
                });
            } else {
                alert("선호도 수정에 실패했습니다. 다시 시도해주세요");
            }
        } catch (error) {
            console.error("선호도 수정 서버 요청 오류:", error);
            alert(
                "서버 오류로 선호도를 수정하지 못했습니다. 다시 시도해주세요."
            );
        }
    };

    return (
        <>
            <TopBar />
            <div className="container">
                <div className="d-flex mt-5 ">
                    <h4 style={{ fontWeight: "bold" }}>
                        {userInfo?.nickname}님의 선호도를 기반으로 데이트 장소를
                        추천해 드려요😊
                    </h4>
                </div>
                <div className="text-muted mb-5">
                  🌟선호도는 <strong>카테고리 당 1개 이상</strong> 선택해주세요
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
                                        * 최소 1개 이상 선택 
                                    </span>
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
                            <br />
                            <button
                                onClick={() => navigate(-1)}
                                className="btn btn-secondary mt-2"
                            >
                                다음에 수정하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditPreference;
