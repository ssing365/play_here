import axios from "axios";
import TopBar from "../components/TopBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useEffect, useState } from "react";
import { Container, Nav, Form, Button, Row, Col, Badge, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const App = () => {
    const [places, setPlaces] = useState([]);
    const [showModal, setShowModal] = useState(false); // 모달 표시 상태
    const [searchCategory, setSearchCategory] = useState([]);
    const [searchLocation, setSearchLocation] = useState([]);
    const [searchWord,setSearchWord] = useState();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [pagecount, setPagecount] = useState(0);

    const { userInfo, isLoggedIn } = useContext(UserContext);
    const userId = userInfo?.userId;

    // 장소 리스트 불러오는 함수 분리
    const fetchPlace = async () => {
        try {
            const searchWordArray = searchWord ? searchWord.split(" ") : [];
            const response = await axios.get(`http://localhost:8586/placeList.do?pageNum=${currentPage}&searchWord=${searchWordArray}&searchLocation=${searchLocation}&searchCategory=${searchCategory}`,
                {pageNum:currentPage, searchWord:searchWordArray, searchLocation : searchLocation, searchCategory : searchCategory}
            );
            setPlaces(response.data);
            setPagecount(response.data.length);
        } catch (error) {
            console.error("장소 리스트 불러오기 실패:", error);
        }
    };

    // 컴포넌트 마운트 시 리스트 불러오기
    useEffect(() => {
        fetchPlace();
    }, []);


    useEffect(() => {
        fetchPlace();
    }, [currentPage]);


    // 좋아요 클릭 시 처리
    const handleLikeClick = async (PlaceId, e) => {
        if (!isLoggedIn) {
            e.preventDefault(); // 기본 페이지 이동 막기
            setShowModal(true); // 모달 표시
        } else {
            try {
                await axios.post("http://localhost:8586/placeLike.do", { PlaceId, userId });
                fetchPlace(); // 좋아요 누른 후 최신 데이터 반영
            } catch (error) {
                console.error("좋아요 요청 중 오류 발생:", error);
            }
        }
    };

    const handleLocationClick = (location) => {
        setSearchLocation((prev) => {
            const newLocations = prev.includes(location)
                ? prev.filter((item) => item !== location) // 선택 해제
                : [...prev, location]; // 선택 추가
            return newLocations;
        });
    };
    
    // ✅ searchLocation이 변경되면 자동으로 fetchPlace 실행
    useEffect(() => {
        if (searchLocation !== undefined) {
            fetchPlace();
        }
    }, [searchLocation]);
    

    const handleCategoryClick = (category) => {
        setSearchCategory((prev) => {
            const newCategories = prev.includes(category)
                ? prev.filter((item) => item !== category) // 선택 해제
                : [...prev, category]; // 선택 추가

                console.log(newCategories);
            return newCategories;
        });
    };

    useEffect(() => {
        fetchPlace();
    }, [searchCategory]);
    
    const locations = [
        "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", 
        "경기", "강원", "충북", "충남", "경북", "경남", "전북", "전남", "제주"
    ];

    const mainCateList = ["먹기", "놀기", "걷기", "마시기", "보기"];

    let Tag = [];
    
    for(let i=0; i<places.length;i++){

        let cateTag = [];
        if (places[i].hashtag) {

            for(let j=0;j<places[i].hashtag.length;j++){
                cateTag.push(
                    <Badge
                    bg="light"
                    text="dark"
                    className="me-1"
                    >
                        {places[i].hashtag[j]}
                    </Badge>
                )
            }
        }
        Tag.push(
            <div className="mb-4">
                    <Row>
                        <Col md={4}>
                            <div className="position-relative">
                                <img
                                    src={places[i].image}
                                    onClick={()=>window.location.href=`/place?id=${places[i].place_id}`}
                                    alt="장소 이미지"
                                    className="rounded w-100"
                                    style={{ height:"300px", objectFit: "cover", width: "100%"}}
                                />
                                <div className="position-absolute top-0 start-0 m-2">
                                    <Badge bg="dark" className="opacity-75">
                                        검색
                                    </Badge>
                                </div>
                            </div>
                        </Col>
                        <Col md={8}>
                            <div className="h-100 d-flex flex-column justify-content-center">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h5 className="mb-1" onClick={()=>window.location.href=`/place?id=${places[i].place_id}`}>{places[i].place_name}</h5>
                                        <div className="text-muted small">
                                            {places[i].location_short} 
                                        </div>

                                        <div className="text-muted small mb-2">
                                            {cateTag}
                                        </div>
                                    </div>
                                    <Button variant="outline-danger" size="sm"
                                    onClick={(e)=>handleLikeClick(places[i].place_id,e)}
                                    >
                                        ♥ {places[i].likes}
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
        )
    }

    return (
        <>
            <TopBar />
            {/* 카테고리 필터 */}
            <Container className="mb-4">
                <div className="d-flex justify-content-center">
                    <Nav variant="pills" defaultActiveKey="all" className="mb-3">
                        <Nav.Item>
                            <Nav.Link eventKey="all" onClick={() => handleCategoryClick("all")}>
                                전체
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="restaurant" onClick={() => handleCategoryClick("restaurant")}>
                                식당&카페
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="attractions" onClick={() => handleCategoryClick("attractions")}>
                                가볼 만한 곳
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="events" onClick={() => handleCategoryClick("events")}>
                                축제ㆍ공연ㆍ행사
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
                <div className="d-flex justify-content-end mb-3">
                    <Button variant="outline-secondary" className="me-2">
                        관련도순
                    </Button>
                    <Button variant="outline-secondary" className="me-2">
                        최신순
                    </Button>
                    <Button variant="outline-secondary">인기순</Button>
                </div>
            </Container>

            {/* 검색 필터 */}
            <Container>
                <div className="border p-3 mb-4">
                    <h5>지역</h5>
                    <div>
                        {locations.map((location) => (
                            <Button
                                key={location}
                                variant={searchLocation.includes(location) ? "primary" : "outline-secondary"}
                                onClick={() => handleLocationClick(location)}
                                className="m-1"
                            >
                                #{location}
                            </Button>
                        ))}
                    </div>
                    <hr />
                    <h5>카테고리</h5>
                    <div className="mb-3 d-flex flex-wrap gap-2">
                        {mainCateList.map((cate) => (
                            <Button
                            key={cate}
                            variant={searchCategory.includes(cate) ? "primary" : "outline-secondary"}
                            onClick={() => handleCategoryClick(cate)}
                            >
                            #{cate}
                            </Button>
                        ))}
                        </div>
                    <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                        <Form.Control
                            type="text"
                            placeholder="검색어 입력"
                            className="me-2"
                            value={searchWord || ""}
                            onChange={(e) => {setSearchWord(e.target.value);
                            }}
                        />
                        <Button variant="primary" 
                        onClick={() => fetchPlace()}>확인</Button>
                    </Form>
                </div>
            </Container>

            {/* 결과 리스트 */}
            <Container>
                {Tag}
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
                            setCurrentPage(currentPage-1);  // 현재 페이지를 클릭한 경우에도 fetchPlace 실행
                            fetchPlace();
                        }}
                    >
                        {currentPage-1}
                    </Button>
                    </>
                )}

                <Button
                    variant="outline-secondary"
                    className="mx-1"
                    onClick={() => {
                        setCurrentPage(currentPage);  // 현재 페이지를 클릭한 경우에도 fetchPlace 실행
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
                            setCurrentPage(currentPage+1);  // 현재 페이지를 클릭한 경우에도 fetchPlace 실행
                            fetchPlace();
                        }}
                    >
                        {currentPage+1}
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

            {/* 로그인 요청 모달 */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body>관심리스트를 이용하려면 로그인해야 합니다.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={() => navigate("/login")}>
                        로그인하기
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default App;
