import { useState } from "react";
import DatePicker from "react-datepicker";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import { Container, Navbar, Nav, Form, Button, Row, Badge } from "react-bootstrap";
import { Calendar, X } from 'lucide-react';
import TopBar from "../components/TopBar";

const likedItems = [
  {
    name: "연남토마",
    imageUrl: "https://image.toast.com/aaaaaqx/catchtable/shopmenu/smROLHx_6mjlRTyatx4bSkA/mrolhx_6mjlrtyatx4bska_244415531261767.png",
    category: "검색",
    tags: ["클린컨텐츠", "코리안", "피자파스타"],
    rating: "4.3",
    reviewCount: "30",
    location: "마포구 연남동",
    distance: "13km",
    priceRange: "11,000원 대"
  },
  {
    name: "을지로 밤과낮",
    imageUrl: "https://picsum.photos/seed/picsum/200/300",
    category: "맛집",
    tags: ["브런치", "카페", "디저트"],
    rating: "4.5",
    reviewCount: "128",
    location: "중구 을지로",
    distance: "5km",
    priceRange: "15,000원 대"
  },
  {
    name: "성수동 커피",
    imageUrl: "https://via.placeholder.com/600/92c952",
    category: "카페",
    tags: ["커피", "브런치", "디저트"],
    rating: "4.7",
    reviewCount: "256",
    location: "성동구 성수동",
    distance: "8km",
    priceRange: "8,000원 대"
  },
  {
    name: "이태원 스테이크",
    imageUrl: "/api/placeholder/400/225",
    category: "맛집",
    tags: ["양식", "스테이크", "와인"],
    rating: "4.6",
    reviewCount: "89",
    location: "용산구 이태원동",
    distance: "10km",
    priceRange: "45,000원 대"
  },
  {
    name: "홍대 타코",
    imageUrl: "https://via.placeholder.com/600/f66b97",
    category: "맛집",
    tags: ["멕시칸", "타코", "브런치"],
    rating: "4.4",
    reviewCount: "167",
    location: "마포구 홍대입구",
    distance: "12km",
    priceRange: "13,000원 대"
  },
  {
    name: "삼청동 한식",
    imageUrl: "https://via.placeholder.com/600/51aa97",
    category: "맛집",
    tags: ["한식", "전통", "코스요리"],
    rating: "4.8",
    reviewCount: "203",
    location: "종로구 삼청동",
    distance: "7km",
    priceRange: "35,000원 대"
  },
  {
    name: "신촌 라멘",
    imageUrl: "https://via.placeholder.com/600/1ee8a4",
    category: "맛집",
    tags: ["일식", "라멘", "돈코츠"],
    rating: "4.2",
    reviewCount: "145",
    location: "서대문구 신촌동",
    distance: "15km",
    priceRange: "9,000원 대"
  },
  {
    name: "강남 스시",
    imageUrl: "https://via.placeholder.com/600/197d29",
    category: "맛집",
    tags: ["일식", "스시", "오마카세"],
    rating: "4.9",
    reviewCount: "78",
    location: "강남구 신사동",
    distance: "9km",
    priceRange: "150,000원 대"
  },
  {
    name: "망원 베이커리",
    imageUrl: "https://via.placeholder.com/150/8985dc",
    category: "카페",
    tags: ["베이커리", "디저트", "브런치"],
    rating: "4.5",
    reviewCount: "234",
    location: "마포구 망원동",
    distance: "11km",
    priceRange: "5,000원 대"
  },
  {
    name: "압구정 와인바",
    imageUrl: "https://via.placeholder.com/600/fdf73e",
    category: "술집",
    tags: ["와인", "양식", "안주"],
    rating: "4.7",
    reviewCount: "156",
    location: "강남구 압구정동",
    distance: "8km",
    priceRange: "50,000원 대"
  }
];

const MyPageLikes = () => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [openDatePickerIndex, setOpenDatePickerIndex] = useState(null); // 각 항목에 대한 달력 상태 관리

  const handleMouseEnter = (index) => setHoverIndex(index);
  const handleMouseLeave = () => {
    setHoverIndex(null);
    setOpenDatePickerIndex(null); // 마우스를 떠나면 달력 닫기
  };

  const handleDelete = (index) => {
    console.log(`항목 삭제: ${likedItems[index].name}`);
  };

  const handleDatePickerToggle = (index) => {
    setOpenDatePickerIndex(openDatePickerIndex === index ? null : index); // 해당 항목의 달력을 토글
  };

  return (
    <>
      {/* 네비게이션 바 */}
      <TopBar />

      {/* 페이지 제목 */}
      <Container className="mb-4">
        <h2 className="text-center">홍길동님의 좋아요 리스트</h2>
      </Container>

      {/* 좋아요 리스트 */}
      <Container>
        {likedItems.map((item, index) => (
          <Row md={4} key={index} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
            <div key={index} className="position-relative">
              <img 
                src="https://image.toast.com/aaaaaqx/catchtable/shopmenu/smROLHx_6mjlRTyatx4bSkA/mrolhx_6mjlrtyatx4bska_244415531261767.png"
                alt={item.name} 
                className="rounded w-100 h-auto"
                style={{ objectFit: 'cover' }}
              />
              <div className="position-absolute top-0 start-0 m-2">
                <Badge bg="dark" className="opacity-75">{item.category}</Badge>
              </div>
              {hoverIndex === index && (
                <div className="position-absolute end-0 top-0 p-2 d-flex gap-2" style={{ zIndex: 2 }}>
                  <Button 
                    variant="light" 
                    className="rounded-circle p-1" 
                    onClick={() => handleDatePickerToggle(index)}
                  >
                    <Calendar size={20} />
                  </Button>
                  <Button 
                    variant="light" 
                    className="rounded-circle p-1" 
                    onClick={() => handleDelete(index)}
                  >
                    <X size={20} />
                  </Button>
                </div>
              )}
            </div>
            <div className="mt-2">
              <h5>{item.name}</h5>
              <p className="mb-1">{item.location} - {item.distance}</p>
              <p className="mb-1">
                {item.tags.map((tag, i) => (
                  <Badge bg="secondary" className="me-1" key={i}>{tag}</Badge>
                ))}
              </p>
              <p className="text-muted">
                ⭐ {item.rating} ({item.reviewCount}개 리뷰) | 💰 {item.priceRange}
              </p>
              {openDatePickerIndex === index && (
                <DatePicker 
                  selected={startDate} 
                  onChange={(date) => setStartDate(date)} 
                  inline
                />
              )}
            </div>
          </Row>
        ))}
      </Container>
    </>
  );
};

export default MyPageLikes;