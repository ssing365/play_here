import axios from "axios";
import TopBar from "../components/TopBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useEffect, useState } from "react";
import {
    Container,
    Nav,
    Form,
    Button,
    Row,
    Col,
    Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import Swal from "sweetalert2";

const SearchList = () => {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8586/placeList.do"
                );
                console.log(response.data);
                setPlaces(response.data); // 받아온 데이터를 상태에 저장
            } catch (error) {
                console.error("Error fetching places:", error);
            }
        };
        fetchPlace();
    }, []);
    const navigate = useNavigate();

    const { userInfo, isLoggedIn } = useContext(UserContext);
    const userId = userInfo?.userId;

    // 장소 리스트 불러오는 함수 분리
    const fetchPlace = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8586/placeList.do"
            );
            setPlaces(response.data);
        } catch (error) {
            console.error("장소 리스트 불러오기 실패:", error);
        }
    };

    // 컴포넌트 마운트 시 리스트 불러오기
    useEffect(() => {
        fetchPlace();
    }, []);

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
            <div className="mb-4" key={places[i].place_id}>
                <Row>
                    <Col md={4}>
                        <div className="position-relative">
                            <img
                                src={places[i].image}
                                onClick={() =>
                                    (window.location.href = `/place?id=${places[i].place_id}`)
                                }
                                alt="장소 이미지"
                                className="rounded w-100"
                                style={{
                                    height: "300px",
                                    objectFit: "cover",
                                    width: "100%",
                                }}
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
                                    <h5
                                        className="mb-1"
                                        onClick={() =>
                                            (window.location.href = `/place?id=${places[i].place_id}`)
                                        }
                                    >
                                        {places[i].place_name}
                                    </h5>
                                    <div className="text-muted small">
                                        {places[i].location_short}
                                    </div>

                                    <div className="text-muted small mb-2">
                                        {cateTag}
                                    </div>
                                </div>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={(e) =>
                                        handleLikeClick(places[i].place_id, e)
                                    }
                                >
                                    ♥ {places[i].likes}
                                </Button>
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
            {/* 카테고리 필터 */}
            <Container className="mb-4">
                <div className="d-flex justify-content-center">
                    <Nav
                        variant="pills"
                        defaultActiveKey="all"
                        className="mb-3"
                    >
                        <Nav.Item>
                            <Nav.Link eventKey="all">전체</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="restaurant">식당&카페</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="attractions">
                                가볼 만한 곳
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="events">
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
                    <div className="mb-3 d-flex flex-wrap gap-2">
                        <Button variant="outline-primary">#전체</Button>
                        <Button variant="outline-secondary">#서울</Button>
                        <Button variant="outline-secondary">#부산</Button>
                        <Button variant="outline-secondary">#대구</Button>
                        <Button variant="outline-secondary">#인천</Button>
                        <Button variant="outline-secondary">#광주</Button>
                        <Button variant="outline-secondary">#대전</Button>
                        <Button variant="outline-secondary">#울산</Button>
                        <Button variant="outline-secondary">#세종</Button>
                        <Button variant="outline-secondary">#경기</Button>
                        <Button variant="outline-secondary">#강원</Button>
                        <Button variant="outline-secondary">#충북</Button>
                        <Button variant="outline-secondary">#충남</Button>
                        <Button variant="outline-secondary">#경북</Button>
                        <Button variant="outline-secondary">#경남</Button>
                        <Button variant="outline-secondary">#전북</Button>
                        <Button variant="outline-secondary">#전남</Button>
                        <Button variant="outline-secondary">#제주</Button>
                    </div>
                    <hr />
                    <h5>카테고리</h5>
                    <div className="mb-3 d-flex flex-wrap gap-2">
                        <Button variant="outline-primary">#먹기</Button>
                        <Button variant="outline-secondary">#놀기</Button>
                        <Button variant="outline-secondary">#걷기</Button>
                        <Button variant="outline-secondary">#마시기</Button>
                        <Button variant="outline-secondary">#보기</Button>
                    </div>
                    <Form className="d-flex">
                        <Form.Control
                            type="text"
                            placeholder="검색어 입력"
                            className="me-2"
                        />
                        <Button variant="primary">확인</Button>
                        <Button variant="outline-secondary" className="ms-2">
                            초기화
                        </Button>
                    </Form>
                </div>
            </Container>

            {/* 결과 리스트 */}
            <Container>{Tag}</Container>
        </>
    );
};

export default SearchList;
