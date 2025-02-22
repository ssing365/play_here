import { Offcanvas, Container, Row, Col, Button, Card } from "react-bootstrap";

const PlaceDetailOffcanvas = ({ show, handleClose, place }) => {
  return (
    <Offcanvas show={show} onHide={handleClose} placement="start" className="custom-offcanvas">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{place.place_name}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Container>
          <img
            src={place.image}
            alt={place.place_name}
            className="w-100 rounded-3 mb-4"
            style={{ height: "250px", objectFit: "cover" }}
          />
          <Row>
            <Col>
              <p className="text-muted">{place.location_short}</p>
              <div className="hashtags">
                {place.hashTags.map((tag, index) => (
                  <span key={index} className="hashtag">#{tag}</span>
                ))}
              </div>
            </Col>
          </Row>
          <Card className="mt-3">
            <Card.Body>
              <p><strong>시간 :</strong> {place.time}</p>
              <p><strong>휴무 :</strong> {place.dayoff}</p>
              <p><strong>주차 :</strong> {place.parking}</p>
              <p><strong>연락처 :</strong> {place.call}</p>
            </Card.Body>
          </Card>
        </Container>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default PlaceDetailOffcanvas;

/**
 * 🔹 Offcanvas 호출하는 방법
 * 
const [showOffcanvas, setShowOffcanvas] = useState(false);
const [selectedPlace, setSelectedPlace] = useState(null);

const handleShow = (place) => {
    setSelectedPlace(place);
    setShowOffcanvas(true);
};

const handleClose = () => setShowOffcanvas(false);

// 장소 리스트에서 클릭 시 Offcanvas 열기
<Button onClick={() => handleShow(place)}>상세 보기</Button>

// Offcanvas 컴포넌트 사용
<PlaceDetailOffcanvas show={showOffcanvas} handleClose={handleClose} place={selectedPlace} />

 */