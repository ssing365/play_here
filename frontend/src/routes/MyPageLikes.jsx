import { useContext, useEffect, useState, useRef, useMemo } from "react";
import DatePicker from "react-datepicker";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "../css/MyPageLikes.css";
import { Container, Button, Badge } from "react-bootstrap";
import { Calendar, X, Check, Trash } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const MyPageLikes = () => {
    const navigate = useNavigate();
    const { userInfo } = useContext(UserContext);
    const userId = userInfo?.userId;
    const coupleId = userInfo?.coupleId;
    const [interests, setInterests] = useState([]);
    const [openDatePickerIndex, setOpenDatePickerIndex] = useState(null);
    const [tempDate, setTempDate] = useState(null); // 임시 날짜 저장
    const [selectedDates, setSelectedDates] = useState({}); // 최종 선택된 날짜
    const datepickerRef = useRef(null);

    // 검색어와 현재 페이지 상태 관리
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // 한 페이지당 표시할 아이템 수 (예시)

    // 검색어가 바뀔 때마다, 페이지를 1로 초기화
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // 검색
    const filteredInterests = useMemo(() => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return interests.filter((place) => {
          // placeName 비교 (소문자 변환 후 포함 여부)
          const placeNameMatch = place.placeName?.toLowerCase().includes(lowerSearchTerm);
          
          // location 및 location_short 비교
          const locationMatch = place.location?.toLowerCase().includes(lowerSearchTerm) ||
                                  place.location_short?.toLowerCase().includes(lowerSearchTerm);
          
          // hashtag는 배열이므로, 각 항목을 소문자로 변환 후 검색어 포함 여부 체크
          const hashtagMatch = Array.isArray(place.hashtag) 
            ? place.hashtag.some((tag) => tag.toLowerCase().includes(lowerSearchTerm))
            : false;
          
          return placeNameMatch || locationMatch || hashtagMatch;
        });
      }, [interests, searchTerm]);

    // 페이징 처리
    const totalPages = Math.ceil(filteredInterests.length / itemsPerPage);
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentInterests = filteredInterests.slice(indexOfFirst, indexOfLast);

    // 관심 장소 불러오기
    const fetchInterest = async () => {
        if (!userId) return;
        try {
            const response = await axios.post(
                "http://localhost:8586/interests.do",
                { userId },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log(response.data);
            setInterests(response.data || []);
        } catch (error) {
            console.error("장소 리스트 불러오기 실패:", error);
            setInterests([]);
        }
    };

    console.log(interests);
    useEffect(() => {
        fetchInterest();
    }, [userId]);

    // 캘린더 열기/닫기
    const handleDatePickerToggle = (index) => {
        if (openDatePickerIndex === index) {
            setOpenDatePickerIndex(null);
        } else {
            setTempDate(selectedDates[index] || new Date()); // 기본값: 오늘 날짜
            setOpenDatePickerIndex(index);
            setTimeout(() => {
                if (datepickerRef.current) {
                    datepickerRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }
            }, 80); // 살짝 딜레이 줘서 자연스럽게 스크롤
        }
    };

    // 캘린더에 일정 추가 submit
    const handleConfirmDate = async (placeId, visitDate) => {
        if (userInfo?.coupleStatus === 0) {
            // e.preventDefault(); // 기본 페이지 이동 막기
            Swal.fire({
                icon: "warning",
                title: "커플 연결을 해주세요",
                text: "캘린더를 이용하려면 커플 연결을 해야합니다.",

                showCancelButton: true,
                confirmButtonText: "커플 연결하기",
                confirmButtonColor: "#e91e63",
                cancelButtonText: "닫기",
                cancelButtonColor: "#666666",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/connect-couple");
                }
            });
        } else {
            try {
                const response = await axios.post("http://localhost:8586/addCalendar.do", {
                    placeId,
                    coupleId,
                    visitDate
                });
                const check = response.data;
                setOpenDatePickerIndex(null); // DatePicker 닫기
                fetchInterest(); // 최신 데이터 반영
                if(check===1){
                    Swal.fire({
                        title: "캘린더에 성공적으로 추가되었습니다!",
                        icon: "success",
    
                        showCancelButton: true,
                        confirmButtonColor: "#e91e63",
                        cancelButtonColor: "#666",
                        confirmButtonText: "캘린더 보러가기",
                        cancelButtonText: "닫기",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/calendar");
                        }
                    });
                }
                else{
                    Swal.fire({
                        title: "이미 방문리스트에 존재합니다!",
                        icon: "warning",
    
                        showCancelButton: true,
                        confirmButtonColor: "#e91e63",
                        cancelButtonColor: "#666",
                        confirmButtonText: "캘린더 보러가기",
                        cancelButtonText: "닫기",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/calendar");
                        }
                    });
                }
            } catch (error) {
                console.error("캘린더 추가 요청 중 오류 발생:", error);
                alert("캘린더 추가 중 오류가 발생했습니다."); // 실패 알림
                setOpenDatePickerIndex(null); // 오류 발생 시에도 DatePicker 닫기
            }
        }
    };

    const continueOn = (placeName) => {
        return Swal.fire({
            title: "좋아요 리스트에서 삭제할까요?",
            text: placeName,
            icon: "warning",

            showCancelButton: true,
            confirmButtonColor: "#e91e63",
            cancelButtonColor: "#666",
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
        }).then((result) => {
            if (result.isConfirmed) return true;
            else return false;
        });
    };

    const interestDelete = async (placeId, placeName) => {
        const confirmed = await continueOn(placeName);
        console.log(placeId);
        if (confirmed) {
            try {
                await axios.post("http://localhost:8586/interestCancel.do", {
                    placeId,
                    userId,
                });
                fetchInterest(); // 최신 데이터 반영
            } catch (error) {
                console.error("관심리스트 삭제 요청 중 오류 발생:", error);
            }
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                openDatePickerIndex !== null &&
                datepickerRef.current &&
                !datepickerRef.current.contains(event.target)
            ) {
                handleDatePickerToggle(null); // DatePicker 닫기
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDatePickerIndex]);

    return (
        <>
            <TopBar />
            <div className="custom-background">
                <Container className="custom-container">
                    <br />
                    <h4>
                        {" "}
                        <b>
                            {userInfo?.nickname || "Loading..."}님의 좋아요
                            리스트
                        </b>{" "}
                    </h4>
                    <hr />
                    <div className="mp__search-input">
                        <input
                            type="text"
                            placeholder=" 🔍 장소 검색"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </Container>
                <Container className="custom-container">
                    <div>
                        {filteredInterests.length === 0 ? (
                            <p className="text-center mt-5">
                                아직 좋아요한 장소가 없습니다.
                            </p>
                        ) : (
                            currentInterests.map((interest, index) => (
                                <div
                                    key={index}
                                    className="position-relative mb-5 d-flex align-items-center"
                                >
                                    <img
                                        src={interest.image}
                                        alt={interest.placeName}
                                        className="rounded"
                                        style={{
                                            width: "250px",
                                            height: "200px",
                                            objectFit: "cover",
                                            cursor: "pointer",
                                        }}
                                        onClick={() =>
                                            (window.location.href = `/place?id=${interest.placeId}`)
                                        }
                                    />
                                    <div className="ms-3" style={{ flex: 1 }}>
                                        <div className="position-absolute top-0 start-0 m-2">
                                            <Badge
                                                bg="dark"
                                                className="opacity-75"
                                            >
                                                {interest.category}
                                            </Badge>
                                        </div>

                                        <div className="mt-2">
                                            <h5
                                                onClick={() =>
                                                    (window.location.href = `/place?id=${interest.placeId}`)
                                                }
                                                style={{ cursor: "pointer" }}
                                            >
                                                <b>{interest.placeName}</b>
                                            </h5>
                                            <p className="mb-1">
                                                {interest.location_short}
                                            </p>
                                            <p className="mb-1">
                                                {interest.tags?.map(
                                                    (tag, i) => (
                                                        <Badge
                                                            bg="secondary"
                                                            className="me-1"
                                                            key={i}
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    )
                                                )}
                                            </p>
                                            <p className="likes-container">
                                                ❤ {interest.likes}
                                            </p>

                                            <div className="mt-3 d-flex gap-2">
                                                <button
                                                    className="mp__cal-add-btn d-flex align-items-center"
                                                    onClick={() =>
                                                        handleDatePickerToggle(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <Calendar size={20} />
                                                    캘린더에 일정 추가하기
                                                </button>
                                            </div>

                                            {selectedDates[index] && (
                                                <p className="text-muted mt-2">
                                                    📅{" "}
                                                    {selectedDates[
                                                        index
                                                    ]?.toLocaleDateString()}
                                                </p>
                                            )}

                                            {openDatePickerIndex === index && (
                                                <div
                                                    ref={datepickerRef}
                                                    className="datepicker-popup position-absolute p-3 bg-white border rounded shadow mt-2"
                                                    style={{ zIndex: 10 }}
                                                >
                                                    <DatePicker
                                                        inline
                                                        dateFormat="yyyy-MM-dd"
                                                        selected={tempDate}
                                                        onChange={(date) =>
                                                            setTempDate(date)
                                                        }
                                                    />
                                                    <div className="d-flex justify-content-end gap-2 mt-2">
                                                        <p className="text-center fw-bold m-1">
                                                            {tempDate
                                                                ? tempDate.toLocaleDateString()
                                                                : "날짜 선택"}
                                                        </p>
                                                        <Button
                                                            className="add-btn p-2"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleConfirmDate(
                                                                    interest.placeId,
                                                                    tempDate
                                                                )
                                                            }
                                                        >
                                                            캘린더에 추가하기
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline-danger"
                                        className="p-1 ms-auto"
                                        onClick={() =>
                                            interestDelete(
                                                interest.placeId,
                                                interest.placeName
                                            )
                                        }
                                    >
                                        <X size={20} />
                                    </Button>
                                </div>
                            ))
                        )}

                        {/* 페이지네이션 컨트롤 */}
                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center mt-4">
                                {Array.from(
                                    { length: totalPages },
                                    (_, idx) => (
                                        <Button
                                            key={idx}
                                            variant={
                                                currentPage === idx + 1
                                                    ? "secondary"
                                                    : "outline-secondary"
                                            }
                                            onClick={() =>
                                                setCurrentPage(idx + 1)
                                            }
                                            className="mx-1"
                                        >
                                            {idx + 1}
                                        </Button>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </Container>
            </div>

            <Footer />
        </>
    );
};

export default MyPageLikes;
