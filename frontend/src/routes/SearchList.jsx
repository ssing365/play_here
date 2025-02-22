import axios from "axios";
import TopBar from "../components/TopBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Badge } from "react-bootstrap";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import SearchFilter from "../components/SearchList/SearchFilter";
import qs from "qs";

const SearchList = () => {
    // useLocation을 이용해 navigate로 전달된 state를 추출
    const location = useLocation();

    const [places, setPlaces] = useState([]);
    const [searchCategory, setSearchCategory] = useState([]);
    const [searchLocation, setSearchLocation] = useState([]);
    const [searchWord, setSearchWord] = useState();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [pagecount, setPagecount] = useState(0);
    const [activeSort, setActiveSort] = useState("latest"); // 최신순 or 좋아요순

    const { userInfo, isLoggedIn } = useContext(UserContext);
    const userId = userInfo?.userId;

    const results = location.state;

    // 상단바에서 입력한 키워드로 렌더링 후 키워드 필터 검색창에 옮겨놓고 삭제.(필요)
    useEffect(() => {
        if (results && results.results) {
            setPlaces(results.results);
            setPagecount(results.results.length);
            setSearchWord(results.keyword);
            // 현재 URL의 state를 비워서 이후에는 results가 없도록 함.
            navigate(location.pathname, { replace: true, state: {} });
        } else {
            fetchPlace();
        }
    }, [currentPage, activeSort, results]);

    // 장소 리스트 불러오는 함수 분리
    const fetchPlace = async () => {
        try {
            const searchWordArray = searchWord ? searchWord.split(" ") : [];
            // 공통 파라미터 구성
            const params = {
                searchWord: searchWordArray,
                searchLocation: searchLocation,
                searchCategory: searchCategory,
                pageNum: currentPage,
                userId: userId,
            };

            // 좋아요 정렬 시 새로운 엔드포인트 사용
            let url = "http://localhost:8586/placeList.do";
            if (activeSort === "likes") {
                url = "http://localhost:8586/placeListAll.do";
            }

            const response = await axios.get(url, {
                params,
                paramsSerializer: (params) =>
                    qs.stringify(params, { arrayFormat: "repeat" }), // 배열을 repeat 방식으로 직렬
            });
            console.log(response);
            console.log(response.data);

            setPlaces(response.data);
            setPagecount(response.data.length);
        } catch (error) {
            console.error("장소 리스트 불러오기 실패:", error);
        }
    };

    // 좋아요 클릭 시 처리
    const handleLikeClick = async (PlaceId, e) => {
        if (!isLoggedIn) {
            e.preventDefault(); // 기본 페이지 이동 막기
            Swal.fire({
                icon: "warning",
                title: "로그인을 해주세요",
                text: "좋아요를 이용하려면 로그인이 필요합니다.",

                showCancelButton: true,
                confirmButtonText: "로그인하기",
                confirmButtonColor: "#e91e63",
                cancelButtonText: "닫기",
                cancelButtonColor: "#666666",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login");
                }
            });
        } else {
            try {
                await axios.post("http://localhost:8586/placeLike.do", {
                    PlaceId,
                    userId,
                });
                fetchPlace(); // 좋아요 누른 후 최신 데이터 반영
            } catch (error) {
                console.error("좋아요 요청 중 오류 발생:", error);
            }
        }
    };

    let Tag = [];

    for (let i = 0; i < places.length; i++) {
        let cateTag = [];
        if (places[i].hashtag) {
            for (let j = 0; j < places[i].hashtag.length; j++) {
                cateTag.push(
                    <Badge
                        bg="light"
                        text="dark"
                        className="me-1"
                        key={places[i].hashtag[j]}
                    >
                        {places[i].hashtag[j]}
                    </Badge>
                );
            }
        }
        Tag.push(
            <div
                className="mb-4"
                key={places[i].placeId}
                style={{ cursor: "pointer" }}
            >
                <Row>
                    <Col md={4}>
                        <div className="position-relative">
                            <img
                                src={places[i].image}
                                onClick={() => {
                                    window.location.href = `/place?id=${places[i].placeId}`;
                                }}
                                alt="장소 이미지"
                                className="rounded w-100"
                                style={{
                                    height: "300px",
                                    objectFit: "cover",
                                    width: "100%",
                                }}
                            />
                        </div>
                    </Col>
                    <Col md={8}>
                        <div className="h-100 d-flex flex-column justify-content-center">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h5
                                        className="mb-1"
                                        onClick={() =>
                                            (window.location.href = `/place?id=${places[i].placeId}`)
                                        }
                                    >
                                        {places[i].placeName}
                                    </h5>
                                    <div className="text-muted small">
                                        {places[i].location_short}
                                    </div>

                                    <div className="text-muted small mb-2">
                                        {cateTag}
                                    </div>
                                </div>
                                {places[i].likeStatus == "liked" ? (
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={(e) =>
                                            handleLikeClick(
                                                places[i].placeId,
                                                e
                                            )
                                        }
                                    >
                                        ❤ {places[i].likes}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={(e) =>
                                            handleLikeClick(
                                                places[i].placeId,
                                                e
                                            )
                                        }
                                    >
                                        ❤ {places[i].likes}
                                    </Button>
                                )}

                                {/* <Button
                                    variant="outline-danger"
                                    className="me-2"
                                    onClick={(e) => handleLikeClick(places[i].placeId, e)}
                                >
                                    <Heart size={20}/>{places[i].likes}
                                </Button> */}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }

    return (
        <>
            <TopBar />
            {/* Filter */}
            <SearchFilter
                fetchPlace={fetchPlace}
                searchCategory={searchCategory}
                setSearchCategory={setSearchCategory}
                searchLocation={searchLocation}
                setSearchLocation={setSearchLocation}
                searchWord={searchWord}
                setSearchWord={setSearchWord}
                activeSort={activeSort}
                setActiveSort={setActiveSort}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

            {/* 결과 리스트 */}
            <Container>
                {Tag.length === 0 ? (
                    <div className="no-results mb-5">
                        {searchWord ? (
                            <>
                                <p>
                                    '{searchWord}' 에 대한 검색 결과가 없습니다.
                                </p>
                                <p>
                                    <b>
                                        검색조건과 철자를 확인하고 다시
                                        검색해주세요.
                                    </b>
                                </p>
                            </>
                        ) : (
                            <>
                                <p>
                                    {results?.keyword}에 대한 검색 결과가
                                    없습니다.
                                </p>
                                <p>
                                    <b>
                                        검색조건과 철자를 확인하고 다시
                                        검색해주세요.
                                    </b>
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    Tag
                )}
            </Container>

            {/* 페이지 네비게이션 */}
            <Container className="d-flex justify-content-center my-4">
                {/* 페이지 버튼들 */}
                {/* 이전 페이지 버튼 */}
                {currentPage > 1 && (
                    <>
                        <Button
                            variant="outline-secondary"
                            className="mx-1"
                            onClick={() => {
                                setCurrentPage(currentPage - 1);
                                fetchPlace();
                            }}
                        >
                            이전
                        </Button>
                        <Button
                            variant="outline-secondary"
                            className="mx-1"
                            onClick={() => {
                                setCurrentPage(currentPage - 1); // 현재 페이지를 클릭한 경우에도 fetchPlace 실행
                                fetchPlace();
                            }}
                        >
                            {currentPage - 1}
                        </Button>
                    </>
                )}

                <Button
                    variant="outline-secondary"
                    className="mx-1"
                    onClick={() => {
                        setCurrentPage(currentPage); // 현재 페이지를 클릭한 경우에도 fetchPlace 실행
                        fetchPlace();
                    }}
                    active
                >
                    {currentPage}
                </Button>

                {/* 다음 페이지 버튼 */}
                {pagecount === 10 && (
                    <>
                        <Button
                            variant="outline-secondary"
                            className="mx-1"
                            onClick={() => {
                                setCurrentPage(currentPage + 1); // 현재 페이지를 클릭한 경우에도 fetchPlace 실행
                                fetchPlace();
                            }}
                        >
                            {currentPage + 1}
                        </Button>

                        <Button
                            variant="outline-secondary"
                            className="mx-1"
                            onClick={() => {
                                const newPage = currentPage + 1;
                                setCurrentPage(newPage);
                                fetchPlace(newPage);
                            }}
                        >
                            다음
                        </Button>
                    </>
                )}
            </Container>
        </>
    );
};

export default SearchList;
