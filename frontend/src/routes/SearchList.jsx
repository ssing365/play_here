
import axios from "axios";


import TopBar from "../components/TopBar";


import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Container, Nav, Form, Button, Row, Col, Badge } from "react-bootstrap";

//!! npm install react-bootstrap bootstrap 해야됨 !!
const App = () => {

    const [places, setPlaces] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
    const [showModal, setShowModal] = useState(false); // 모달 표시 상태

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8586/api/check-auth",
                    { withCredentials: true }
                );
                console.log(response);
                setIsLoggedIn(true);
            } catch (error) {
                console.log(error.response);
                console.log(error.response.status);
                if (error.response && error.response.status === 401) {
                    console.log(error);
                    setIsLoggedIn(false);
                } else {
                    console.error("로그인 오류:", error);
                    alert("서버 오류가 발생했습니다.");
                }
            }
        };
        checkAuth();
    }, [isLoggedIn]);

    useEffect(()=>{

        const fetchPlace = async() =>{

            try {
        const response = await axios.get("http://localhost:8586/placeList.do");
        console.log(response.data);
        setPlaces(response.data);  // 받아온 데이터를 상태에 저장

      } catch (error) {
        console.error("Error fetching places:", error);
      }
        }
        fetchPlace();
    },[]);    
    
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
                                    <Button variant="outline-danger" size="sm">
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
            <Container>
                {Tag}
            </Container>
        </>
    );
};

export default App;
