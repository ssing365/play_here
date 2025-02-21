import { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col} from "react-bootstrap";
import { Heart, Share, MapPin } from "lucide-react";

import axios from "axios";
import { useLocation } from "react-router-dom";

const { kakao} = window;
import TopBar from "../components/TopBar";


function Place() {
    const [view, setView] = useState("explore");
    const [place, setPlace] = useState([]);
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const placeId = queryParams.get('id');

    useEffect(()=>{

        const fetchPlace = async() =>{

        try {
            const response = await axios.get(`http://localhost:8586/placeView.do?id=${placeId}`);
            console.log(response.data);
            setPlace(response.data[0]);  // 받아온 데이터를 상태에 저장
            
        } catch (error) {
            console.error("Error fetching place:", error);
        }
            }
            fetchPlace();

        },[placeId]);

        let hashTag = [];
        if (place.hashtag) {

            for(let j=0;j<place.hashtag.length;j++){
                hashTag.push(
                    <p className="text-secondary">{place.hashtag[j]}</p>
                )
            }
        }

        

        useEffect(()=>{
            

            if (!place || !place.latitude || !place.longitude) return; // place가 없으면 실행 X

            const container = document.getElementById("map");
            if (!container) return;

            const options = {
                center: new window.kakao.maps.LatLng(place.latitude, place.longitude),
                level: 3,
            };

            const imageSrc = '../../images/marker.svg'; // 마커이미지의 주소입니다    
            const imageSize = new kakao.maps.Size(64, 69); // 마커이미지의 크기입니다
            const imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다.
            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

            const map = new window.kakao.maps.Map(container, options);

            // 마커 추가

            const marker = new window.kakao.maps.Marker({
                position: options.center,
                image : markerImage
            });
            marker.setMap(map);
        },[place])
    return (
        <>
            {/* 헤더 */}
            <TopBar />
            <Container fluid className="bg-light min-vh-100">
                {/* 본문 */}
                <Container className="mt-4">
                    <img
                        src={place.image}
                        alt={place.place_name}
                        className="w-100 rounded-3 mb-4"
                        style={{height:"500px", objectFit: "cover", width: "100%" }}
                    />

                    <Row className="g-4">
                        {/* 1. 기본 정보 */}
                        <Col md={6}>
                            <h2 className="fw-bold">{place.place_name}</h2>
                            <p className="text-muted">{place.location_short}</p>
                            {hashTag}
                        </Col>
                        <Col md={6} className="text-end">
                            <Button
                                variant="outline-secondary"
                                className="me-2"
                            >
                                <Share size={20} />
                            </Button>
                            <Button variant="outline-danger" className="me-2">
                                <Heart size={20} />
                            </Button>
                            <Button variant="success">
                                캘린더에 일정 추가하기
                            </Button>
                        </Col>
                    </Row>

                    {/* 2. 소개글 */}
                    <Card className="mt-4">
                        <Card.Body>
                            {place.descript}
                        </Card.Body>
                    </Card>

                    {/* 3. 영업 정보 */}
                    <Card className="mt-4">
                        <Card.Body>
                            <p>
                                <strong>시간 : </strong> {place.time}
                            </p>
                            <p>
                                <strong>휴무 : </strong> {place.dayoff}
                            </p>
                            <p>
                                <strong>주차 : </strong> {place.parking}
                            </p>
                        </Card.Body>
                    </Card>

                    {/* 4. 연락처 */}
                    <Card className="mt-4">
                        <Card.Body>
                            <p>
                                <strong>연락처 : </strong>{place.call}
                            </p>
                        </Card.Body>
                    </Card>

                    {/* 5. 지도 */}
                    <Card className="mt-4">
                        <Card.Body>
                            <p>
                                <strong>주소 : </strong>{place.location}
                            </p>
                            <div id="map" 
                                className="position-relative bg-secondary rounded-3"
                                style={{ height: "250px"}}
                            >
                                <Button
                                    variant="outline-light"
                                    className="position-absolute top-2 end-2"
                                >
                                    <MapPin size={20} /> 길찾기
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* 6. 근처 다른 장소 */}
                    <h3 className="mt-4">근처 다른 장소</h3>
                    <Row className="g-3 flex-nowrap overflow-auto">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Col key={i} xs={6} md={3}>
                                <Card>
                                    <div
                                        className="bg-secondary rounded-top"
                                        style={{ height: "150px" }}
                                    ></div>
                                    <Card.Body>
                                        <p className="fw-bold">
                                            거전마을[농촌체험]
                                        </p>
                                        <p className="text-muted">
                                            부여군 온산면
                                        </p>
                                        <p className="text-secondary">
                                            체험 관광
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </Container>
        </>
    );
}

export default Place;
