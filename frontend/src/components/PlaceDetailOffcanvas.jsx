import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Offcanvas, Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const PlaceDetailOffcanvas = ({ show, handleClose, place }) => {
    const placeId = place.placeId;

    const { userInfo } = useContext(UserContext);
    const userId = userInfo?.userId;

    const [liked, setLiked] = useState(false);


    let hashTag = [];
    if (place?.hashtag) {
        for (let j = 0; j < place?.hashtag.length; j++) {
            hashTag.push(<p className="text-secondary">{place?.hashtag[j]}</p>);
        }
    }

    // 좋아요 상태 확인
    if (!userInfo?.userId) {
        console.log("userInfo가 아직 로드되지 않음");
        return;
    }
    /*
    axios
        .get(`http://localhost:8586/likeStatus.do`, {
            params: { userId, placeId },
        })
        .then((response) => {
            setLiked(response.data);
        })
        .catch((error) => {
            console.error("Error fetching like status:", error);
        });*/

    // 좋아요 클릭 시 처리
    const handleLikeClick = async (PlaceId) => {
        try {
            if (!liked) {
                const response = await axios.post(
                    "http://localhost:8586/placeLike.do",
                    {
                        PlaceId,
                        userId,
                    }
                );
                if (response.status === 200) {
                    Swal.fire({
                        title: "좋아요 리스트에 추가되었습니다",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            } else {
                // 좋아요가 현재 false이면 좋아요 취소 호출 (interestCancel.do)
                const response = await axios.post(
                    "http://localhost:8586/placeLike.do",
                    {
                        PlaceId,
                        userId,
                    }
                );
                if (response.status === 200) {
                    Swal.fire({
                        title: "좋아요가 취소되었습니다",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            }
            // UI 업데이트: 좋아요 상태 토글
            setLiked(!liked);
        } catch (error) {
            alert("좋아요에 실패했습니다. 잠시후 다시 시도해주세요.");
            console.error("좋아요 요청 중 오류 발생:", error);
        }
    };

    return (
        <Offcanvas
            show={show}
            onHide={handleClose}
            placement="start"
            className="custom-offcanvas"
        >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>{place.place_name}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Container>
                    <img
                        src={place.image}
                        alt={place.placeName}
                        className="w-100 rounded-3 mb-4"
                        style={{ height: "250px", objectFit: "cover" }}
                    />
                    <Row>
                        <h3 className="fw-bold">{place?.placeName}</h3>

                        <Col>
                            <p className="text-muted">
                                {place.location} <br />
                                <Link
                                    to={place.link}
                                    target="_blank"
                                    style={{ fontSize: "14px" }}
                                >
                                    카카오맵 바로가기
                                </Link>
                            </p>
                        </Col>
                        <div className="hashtags">
                            {hashTag.map((tag, index) => {
                                return (
                                    <span key={index} className="hashtag">
                                        {tag.props.children}
                                    </span>
                                );
                            })}
                        </div>
                    </Row>
                    <Card className="mt-3">
                        <Card.Body>
                            <p>
                                <strong>시간 :</strong> {place.time}
                            </p>
                            <p>
                                <strong>휴무 :</strong> {place.dayoff}
                            </p>
                            <p>
                                <strong>주차 :</strong> {place.parking}
                            </p>
                            <p>
                                <strong>연락처 :</strong> {place.call}
                            </p>
                        </Card.Body>
                    </Card>
                </Container>
                <br />
                {liked ? (
                    <Button
                        variant="danger"
                        className="sm me-2"
                        onClick={(e) => handleLikeClick(placeId, e)}
                    >
                        ❤ {place.likes}
                    </Button>
                ) : (
                    <Button
                        variant="outline-danger"
                        className="sm me-2"
                        onClick={(e) => handleLikeClick(placeId, e)}
                    >
                        ❤ {place.likes}
                    </Button>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default PlaceDetailOffcanvas;