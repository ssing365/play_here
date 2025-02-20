import "../../css/SearchFilter.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Badge } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const SearchFilter = ({
    fetchPlace,
    searchCategory,
    setSearchCategory,
    searchLocation,
    setSearchLocation,
    searchWord,
    setSearchWord,
    activeSort,
    setActiveSort
}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(true); // 🔽 필터 펼침/접힘 상태

    const locations = [
        "서울",
        "부산",
        "대구",
        "인천",
        "광주",
        "대전",
        "울산",
        "세종",
        "경기",
        "강원",
        "충북",
        "충남",
        "경북",
        "경남",
        "전북",
        "전남",
        "제주",
    ];

    const mainCateList = ["먹기", "놀기", "걷기", "마시기", "보기"];

    // 엔터 키 입력 시 검색 실행
    const handleKeyDown = (e) => {
        console.log(e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            fetchPlace();
        }
    };
    // 카테고리 초기화
    const handleReset = () => {
        setSearchCategory([]);
        setSearchLocation([]);
        setSearchWord("");
    };
    // 필터 버튼 클릭 시 펼침/접힘 변경
    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleLocationClick = (location) => {
        setSearchLocation((prev) => {
            const newLocations = prev.includes(location)
                ? prev.filter((item) => item !== location) // 선택 해제
                : [...prev, location]; // 선택 추가
            return newLocations;
        });
    };

    const handleCategoryClick = (category) => {
        setSearchCategory((prev) => {
            const newCategories = prev.includes(category)
                ? prev.filter((item) => item !== category) // 선택 해제
                : [...prev, category]; // 선택 추가

            console.log(newCategories);
            return newCategories;
        });
    };

    return (
        <>
            <div className="filter-container">
                {/* 🔹 정렬 & 필터 토글 버튼 */}
                <div className="sort-filter-bar">
                    <span
                        className={`sort-option ${
                            activeSort === "latest" ? "active" : ""
                        }`}
                        onClick={() => {
                            setActiveSort("latest");
                            fetchPlace();
                        }}
                    >
                        최신순
                    </span>
                    <span
                        className={`sort-option ${
                            activeSort === "likes" ? "active" : ""
                        }`}
                        onClick={() => {
                            setActiveSort("likes");
                            fetchPlace();
                        }}
                    >
                        좋아요순
                    </span>
                    <span className="filter-toggle" onClick={toggleFilter}>
                        {isFilterOpen ? "▲필터" : "▼필터"}
                    </span>
                </div>

                {/* 검색 필터 */}
                {isFilterOpen && (
                    <Container className="search-filter mb-5">
                        {/* 🔍 검색창 */}
                        <Form
                            className="search-bar"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <div className="search-input-container">
                                <Form.Control
                                    type="text"
                                    placeholder="검색어 입력"
                                    value={searchWord}
                                    onChange={(e) =>
                                        setSearchWord(e.target.value)
                                    }
                                    onKeyDown={handleKeyDown} // 엔터 검색 추가
                                    className="filter__search-input"
                                />
                                <button
                                    className="search-btn"
                                    onClick={fetchPlace}
                                >
                                    <FaSearch size={22} color="#666" />
                                </button>
                            </div>
                        </Form>

                        {/* 📌 지역 선택 */}
                        <h5 className="section-title">지역</h5>
                        <div className="location-list">
                            <button
                                className={`location-btn ${
                                    searchCategory.includes(this)
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => setSearchLocation([])}
                            >
                                #전체
                            </button>
                            {locations.map((location, index) => (
                                <Button
                                    key={location}
                                    variant="link"
                                    className={`location-btn ${
                                        searchLocation.includes(location)
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleLocationClick(location)
                                    }
                                >
                                    #{location}
                                </Button>
                            ))}
                        </div>

                        <hr />

                        {/* 📌 카테고리 선택 */}
                        <h5 className="section-title">카테고리</h5>
                        <div className="category-list">
                            <button
                                className={`category-btn ${
                                    searchCategory.includes(this)
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => setSearchCategory([])}
                            >
                                #전체
                            </button>
                            {mainCateList.map((cate) => (
                                <button
                                    key={cate}
                                    className={`category-btn ${
                                        searchCategory.includes(cate)
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() => handleCategoryClick(cate)}
                                >
                                    #{cate}
                                </button>
                            ))}
                        </div>

                        <hr />

                        {/* ✅ 버튼 영역 */}
                        <div className="button-group">
                            <Button variant="custom-pink" onClick={fetchPlace}>
                                확인
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={handleReset}
                            >
                                초기화
                            </Button>
                        </div>
                    </Container>
                )}
            </div>
        </>
    );
};

export default SearchFilter;
