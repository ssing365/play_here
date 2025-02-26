
import React, { useState, useContext, useEffect, useRef } from "react";
import TopBar from "../components/TopBar";
import Diary from "../components/Calendar/Diary";
import Cal from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/Calendar.css";
import { FaSearch } from "react-icons/fa";
import { Button, Form, Row, Col, Card, Container, Spinner } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import PlaceDetailOffcanvas from "../components/PlaceDetailOffcanvas";
import Swal from "sweetalert2";

const Calendar = () => {
    const [date, setDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [places, setPlaces] = useState([]);
    const [diaryEntry, setDiaryEntry] = useState("");
    const [editDiary, setEditDiary] = useState(false);
    const [diaryText, setDiaryText] = useState(diaryEntry || "");
    const [yourDiaryText, setYourDiaryText] = useState(diaryEntry || "");
    const [coupleInfo, setCoupleInfo] = useState(null);
    const [noDiary, setNoDiary] = useState(false);
    const today = new Date();
    const location = useLocation();
    const [diaryWrited, setDiaryWrited] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [activeStartDate, setActiveStartDate] = useState(new Date());
    const [lastVisitPlace, setLastVisitPlace] = useState([]);
    const [loading, setLoading] = useState(true);

    const [matchedDates, setMatchedDates] = useState([]);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [searchSelectedDate, setSearchSelectedDate] = useState(null);

    const [recommendations, setRecommendations] = useState([]);

    // context에서 로그인 상태, 유저 정보 가져오기
    const { userInfo } = useContext(UserContext);
    const userId = userInfo?.userId;
    const coupleId = userInfo?.coupleId;

    // offcanvas 및 상세정보 관련 상태
    const [placeDetail, setPlaceDetail] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const handleClose = () => setShowOffcanvas(false);

    // 다른 페이지에서 전달된 날짜를 읽어와 상태 업데이트
    useEffect(() => {
        if (location.state && location.state.selectedDate) {
            setSelectedDate(new Date(location.state.selectedDate));
        }
    }, [location]);

    //장소 자동완성
    const [newPlace, setNewPlace] = useState("");
    const [placeList, setPlaceList] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);

    // 입력창 표시 여부 (버튼 클릭 시 토글)
    const [showInput, setShowInput] = useState(false);

    // refs
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // API에서 장소 목록 가져오기
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8586/SearchPlace.do"
                );
                setPlaceList(response.data);
            } catch (error) {
                console.error("Error fetching places:", error);
            }
        };
        fetchPlaces();
    }, []);

    // 입력값(newPlace)이 바뀔 때마다 필터링
    useEffect(() => {
        if (newPlace.trim() === "") {
            setFilteredPlaces([]);
            setShowDropdown(false);
        } else {
            const filtered = placeList.filter((place) =>
                place.placeName.toLowerCase().includes(newPlace.toLowerCase())
            );
            setFilteredPlaces(filtered);
            setShowDropdown(filtered.length > 0);
        }
    }, [newPlace, placeList]);

    // 외부 클릭 시 dropdown 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 입력창 변경 이벤트
    const handleInputChange = (e) => {
        setNewPlace(e.target.value);
        setSelectedPlaceId(null);
    };

    // Enter 키 입력 처리
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            if (selectedPlaceId) {
                addPlace({ placeId: selectedPlaceId, placeName: newPlace });
            } else {
                const matchedPlace = placeList.find(
                    (place) =>
                        place.placeName.toLowerCase() === newPlace.toLowerCase()
                );
                if (matchedPlace) {
                    setSelectedPlaceId(matchedPlace.placeId);
                    addPlace({
                        placeId: matchedPlace.placeId,
                        placeName: matchedPlace.placeName,
                    });
                } else {
                    console.log("일치하는 장소가 없습니다.");
                }
            }
            fetchSchedule(activeStartDate);
            setShowDropdown(false);
        }
    };

    // 드롭다운 항목 클릭 처리
    const handleSelectPlace = (place) => {
        setNewPlace(place.placeName);
        setSelectedPlaceId(place.placeId);
        setShowDropdown(false);
        addPlace({ placeId: place.placeId, placeName: place.placeName });
    };

    // 장소 추가 함수
    const addPlace = async (placeObj) => {
        const formattedDate = selectedDate
            .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
            .replace(/\. /g, "-")
            .replace(".", "");
        console.log("추가할 장소:", placeObj);

        await axios.post("http://localhost:8586/addCalendar.do", {
            placeId: placeObj.placeId,
            coupleId,
            visitDate: formattedDate,
        });
        visitList(formattedDate);
        // 추가 후 입력값 초기화
        setNewPlace("");
        // 포커스 처리 (ref null 체크)
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // 장소 정보 가져오기 함수 수정 (id 파라미터 추가)
    const fetchPlace = async (id) => {
        try {
            const response = await axios.get(
                `http://localhost:8586/placeView.do?id=${id}`
            );
            console.log(response.data);
            setPlaceDetail(response.data[0]); // 받아온 데이터를 상태에 저장
        } catch (error) {
            console.error("Error fetching place:", error);
        }
    };

    // 상세보기 버튼 클릭 시 실행할 함수
    const handleShowDetails = async (id) => {
        await fetchPlace(id);
        setShowOffcanvas(true);
    };

    useEffect(() => {
        const coupleInfo = async () => {
            if (coupleId) {
                try {
                    const response = await axios.post(
                        "http://localhost:8586/coupleInfo.do",
                        { coupleId, userId }
                    );
                    if (response.data.length > 0) {
                        setCoupleInfo(response.data[0]);
                    } else {
                        setCoupleInfo({ nickname: "Unknown" }); // 기본값 설정
                    }
                } catch (error) {
                    console.error("Error coupleInfo:", error);
                }
            }
        };
        coupleInfo();
    }, []); // coupleId 변경 시 실행

    useEffect(() => {
        const formattedDate = selectedDate
            .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
            .replace(/\. /g, "-")
            .replace(".", "");
            setShowInput(false);
        lastVisit();
        setNewPlace("");
        visitList(formattedDate);
        if (coupleInfo) {
            diary(formattedDate);
        }
        fetchSchedule(activeStartDate);
        fetchDiaryWrited(activeStartDate);
    }, [selectedDate, coupleInfo]);

    // 일기 가져오기
    const diary = async (formattedDate) => {
        if (coupleId) {
            const response1 = await axios.post(
                "http://localhost:8586/Diary.do",
                {
                    coupleId: coupleId,
                    diaryWriter: userId,
                    diaryDate: formattedDate,
                }
            );
            if (response1.data.length > 0) {
                setNoDiary(false);
                setDiaryText(response1.data[0].content);
            } else {
                setDiaryText("");
                setNoDiary(true);
            }
            const response2 = await axios.post(
                "http://localhost:8586/Diary.do",
                {
                    coupleId: coupleId,
                    diaryWriter: coupleInfo.userId,
                    diaryDate: formattedDate,
                }
            );
            if (response2.data.length > 0) {
                setYourDiaryText(response2.data[0].content);
            } else {
                setYourDiaryText("");
            }
        }
    };

    /* 방문지 리스트 출력 */
    const visitList = async (formattedDate) => {
        try {
            const response1 = await axios.post(
                "http://localhost:8586/visitList.do",
                { visitDate: formattedDate, coupleId: coupleId }
            );
            setPlaces(response1.data); // 상태 업데이트
        } catch (error) {
            console.error("Error visit list :", error);
        }
    };

    useEffect(() => {
        if (newPlace.trim() === "") {
          setFilteredPlaces([]);
          setShowDropdown(false);
        } else {
          const filtered = placeList.filter((p) =>
            // 검색어(newPlace)가 포함된 곳만 남기고
            p.placeName.toLowerCase().includes(newPlace.toLowerCase()) &&
            // 이미 추가된 장소(places)에 같은 placeId가 없는 것만 필터링
            !places.some((added) => String(added.placeId) === String(p.placeId))
          );
          setFilteredPlaces(filtered);
          setShowDropdown(filtered.length > 0);
        }
      }, [newPlace, placeList, places]);
      
    
    //지난 방문지
    const lastVisit = async () => {
        const today = new Date();
        const formattedDate = today
            .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
            .replace(/\. /g, "-")
            .replace(".", "");
        try {
            const response = await axios.post(
                "http://localhost:8586/LastVisit.do",
                { today: formattedDate, coupleId: coupleId }
            );
            setLastVisitPlace(response.data);
        } catch (error) {
            console.error("Error lastvisit list :", error);
        }
    };

    /* 방문지 리스트 드래그 */
    const onDragEnd = async (result) => {
        const { destination, source } = result;
        if (!destination || destination.index === source.index) return;
      
        // 기존 places 배열을 복사하여 순서 변경 (낙관적 업데이트)
        const updatedPlaces = Array.from(places);
        const [removed] = updatedPlaces.splice(source.index, 1);
        updatedPlaces.splice(destination.index, 0, removed);
      
        // UI에 바로 업데이트
        setPlaces(updatedPlaces);
      
        // 업데이트된 순서에 따른 placeIds 배열 생성
        const updatedPlaceIds = updatedPlaces.map((p) => p.placeId);
        const formattedDate = selectedDate
          .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
          .replace(/\. /g, "-")
          .replace(".", "");
      
        try {
          // 백엔드에 순서 변경된 placeIds 전송
          await axios.post("http://localhost:8586/updateVisitOrder.do", {
            placeIds: updatedPlaceIds,
            coupleId: coupleId,
            visitDate: formattedDate,
          });
          // 서버에서 새로운 데이터를 받아오더라도 UI에서 깜빡이지 않도록 상태를 덮어씌움
          const response = await axios.post("http://localhost:8586/visitList.do", {
            visitDate: formattedDate,
            coupleId: coupleId,
          });
          setPlaces(response.data);
        } catch (error) {
          console.error("순서 업데이트 실패:", error);
          // 실패 시 원래 상태로 복구하거나, 에러 처리를 할 수 있음
        }
      };
      

    /* 방문지 삭제 */
    const deletePlace = async (placeId) => {
        console.log(placeId);
        const formattedDate = selectedDate
            .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
            .replace(/\. /g, "-")
            .replace(".", "");
        try {
            await axios.post("http://localhost:8586/visitDelete.do", {
                visitDate: formattedDate,
                coupleId: coupleId,
                placeId: placeId,
            });
            visitList(formattedDate);
            fetchSchedule(activeStartDate);
        } catch (error) {
            console.error("삭제 요청 중 오류 발생:", error);
        }
    };

    /* 방문지 수정 */
    const editPlace = (placeId, newName) => {
        const updatedPlaces = places[selectedDate].map((place) =>
            place.id === placeId ? { ...place, name: newName } : place
        );
        setPlaces({ ...places, [selectedDate]: updatedPlaces });
    };

    // 수정 입력창 관리
    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState("");

    // 백엔드에서 schedule 데이터를 가져오는 함수
    const fetchSchedule = async (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const yearMonth = `${year}-${month}`;
        try {
            const response = await axios.post(
                "http://localhost:8586/Schedule.do",
                { date: yearMonth, coupleId: coupleId }
            );
            setSchedule(response.data);
        } catch (error) {
            console.error("스케줄 데이터를 가져오는데 실패했습니다.", error);
        }
    };

    // 백엔드에서 diaryWrited 데이터를 가져오는 함수
    const fetchDiaryWrited = async (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const yearMonth = `${year}-${month}`;
        try {
            const response = await axios.post(
                "http://localhost:8586/DiaryWrited.do",
                { date: yearMonth, coupleId: coupleId }
            );
            setDiaryWrited(response.data);
        } catch (error) {
            console.error("일기스케줄 데이터를 가져오는데 실패했습니다.", error);
        }
    };

    

    // 컴포넌트 마운트 시 초기 activeStartDate 기준 schedule 데이터 불러오기
    // useEffect(() => {
    //     fetchSchedule(activeStartDate);
    //     fetchDiaryWrited(activeStartDate);
    // }, [selectedDate]);

    // 달력의 월/년이 변경될 때 호출되는 핸들러
    const handleActiveStartDateChange = async ({ activeStartDate }) => {
        setActiveStartDate(activeStartDate);
        fetchSchedule(activeStartDate);
        fetchDiaryWrited(activeStartDate);
    };

    /* 일기, 방문지 추가시 달력에 점 표시 */
    const tileContent = ({ date }) => {
        // 방문지 점 표시
        const isVisitDate = schedule.some((dto) => {
          const visitDate = new Date(dto.visitDate);
          return (
            visitDate.getFullYear() === date.getFullYear() &&
            visitDate.getMonth() === date.getMonth() &&
            visitDate.getDate() === date.getDate()
          );
        });
      
        // 일기 점 표시 (일기 데이터의 날짜 필드가 diaryDate라고 가정)
        const isDiaryDate = diaryWrited.some((dto) => {
          const diaryDate = new Date(dto.diaryDate);
          return (
            diaryDate.getFullYear() === date.getFullYear() &&
            diaryDate.getMonth() === date.getMonth() &&
            diaryDate.getDate() === date.getDate()
          );
        });
      
        if (!isVisitDate && !isDiaryDate) return null;
      
        return (
          <div className="tile-dot-wrapper">
            {isVisitDate && (
              <span className="calendar-dot calendar-visit-dot" title="방문지"></span>
            )}
            {isDiaryDate && (
              <span className="calendar-dot calendar-diary-dot" title="일기"></span>
            )}
          </div>
        );
      };
      

    /** 일기 저장 */
    const saveDiary = async () => {
        if (diaryText.trim()) {
            setDiaryEntry(diaryText);
        } else {
            setDiaryEntry("일기를 남겨주세요");
        }
        setEditDiary(false);
        const formattedDate = selectedDate
            .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
            .replace(/\. /g, "-")
            .replace(".", "");

        if (noDiary) {
            await axios.post("http://localhost:8586/NewDiary.do", {
                coupleId: coupleId,
                diaryWriter: userId,
                diaryDate: formattedDate,
                content: diaryText,
            });
            fetchDiaryWrited(activeStartDate);
            setNoDiary(false);
        } else {
            if (coupleId) {
                if(diaryText.trim()!==""){
                await axios.post("http://localhost:8586/DiaryEdit.do", {
                    coupleId: coupleId,
                    diaryWriter: userId,
                    diaryDate: formattedDate,
                    content: diaryText,
                });
            }
            else{
                    await axios.post("http://localhost:8586/DiaryDelete.do", {
                        coupleId: coupleId,
                        diaryWriter: userId,
                        diaryDate: formattedDate
                    });
                    fetchDiaryWrited(activeStartDate);
            }
            }
        }
        diary(formattedDate);
    };

    const goToNextMatch = () => {
        if (matchedDates.length === 0) return;
        const nextIndex = (currentMatchIndex + 1) % matchedDates.length;
        setCurrentMatchIndex(nextIndex);
        setSelectedDate(new Date(matchedDates[nextIndex]));
    };

    const goToPrevMatch = () => {
        if (matchedDates.length === 0) return;
        const prevIndex =
            (currentMatchIndex - 1 + matchedDates.length) % matchedDates.length;
        setCurrentMatchIndex(prevIndex);
        setSelectedDate(new Date(matchedDates[prevIndex]));
    };

    const handleSearch = async () => {
        const searchWord = searchTerm ? searchTerm.split(" ") : [];
        console.log("handleSearch 호출됨", searchWord);
        if (!searchTerm) {
            setMatchedDates([]);
            Swal.fire({
                icon: "info",
                text: "검색어를 입력해주세요.",
                timer: 1200,
                showConfirmButton: false,
            });
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8586/searchSchedule.do",
                {
                    searchWord: searchWord,
                    coupleId: coupleInfo?.coupleId,
                }
            );
            // 백엔드가 { visitDate: [...] }가 아니라 단순히 배열을 반환할 경우:
            const dates = Array.isArray(response.data)
                ? response.data
                : [response.data];

            console.log("검색 응답:", response.data);

            // ISO 문자열에서 시간대 콜론 제거 후 Date 객체로 변환
            const parsedDates = dates.filter(Boolean).map((dateStr) => {
                const fixedDateStr = dateStr.replace(
                    /(\+\d{2}):(\d{2})$/,
                    "$1$2"
                );
                const d = new Date(fixedDateStr);
                if (isNaN(d.getTime())) {
                    console.error(
                        "Invalid date string:",
                        dateStr,
                        "=>",
                        fixedDateStr
                    );
                }
                return d;
            });

            setMatchedDates(parsedDates);
            setCurrentMatchIndex(0);
            if (parsedDates.length === 0) {
                Swal.fire({
                    icon: "info",
                    text: `'${searchTerm}'와 일치하는 장소가 없습니다.`,
                    timer: 1000,
                    showConfirmButton: false,
                });
                return;
            }
            if (parsedDates.length > 0) {
                setSearchSelectedDate(parsedDates[0]);
                setSelectedDate(parsedDates[0]);
            }
        } catch (error) {
            console.error("검색 결과 가져오기 오류:", error);
        }
        goToNextMatch();
    };

    const searchWord = React.useMemo(() => {
        return searchTerm
            ? searchTerm.split(" ").filter((word) => word.trim() !== "")
            : [];
    }, [searchTerm]);

    const highlightText = (text, keywords) => {
        if (!keywords || keywords.length === 0) return text;

        // 정규식에서 특별한 의미를 갖는 문자를 이스케이프합니다.
        const escapedKeywords = keywords.map((keyword) =>
            keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        );

        const regex = new RegExp(`(${escapedKeywords.join("|")})`, "gi");
        const parts = text.split(regex);
        return parts.map((part, index) =>
            regex.test(part) ? (
                <span
                    key={index}
                    style={{ backgroundColor: "#FFE0E0", fontWeight: "bold" }}
                >
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/recommend/${userId}`
                );
                console.log("🟢 API 응답 데이터:", response.data);

                if (!response.data || response.data.length === 0) {
                    console.warn(
                        "⚠️ API에서 추천 장소가 비어 있음! 기본 데이터 사용"
                    );
                    
                } else {
                    const randomIndex = Math.floor(Math.random() * response.data.length);
        console.log("선택된 랜덤 인덱스:", randomIndex, response.data[randomIndex]);
        setRecommendations(response.data[randomIndex]);
                }
            } catch (error) {
                console.error("🔴 추천 장소 요청 실패:", error);
                setRecommendations([]);
            }
        };
        fetchRecommendations();
    }, [userInfo]);

    useEffect(() => {
        if (recommendations && Object.keys(recommendations).length > 0) {
          setLoading(false);
        }
      }, [recommendations]);

    return (
        <>
            {/** OFFCANVAS */}
            <PlaceDetailOffcanvas
                show={showOffcanvas}
                handleClose={handleClose}
                place={placeDetail}
            />
            {/** OFFCANVAS */}
            <TopBar />
            <Container fluid className="back-container vh-100">
                <Row className="couple-calendar-container">
                    {/* 왼쪽 커플 캘린더 */}
                    <h4
                    className="mt-2 mb-2 text-center"
                    style={{
                        display: "flex",
                        gridTemplateColumns: "1fr auto 1fr",
                        alignItems: "center",
                        marginRight: "25px"
                    }}
                    >
                    <span
                        style={{
                        textAlign: "right",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        }}
                    >
                        {userInfo ? userInfo.nickname : "Loading..."}
                    </span>
                    <span style={{ textAlign: "center", margin: "0 10px"}}>❤</span>
                    <span
                        style={{
                        textAlign: "left",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        }}
                    >
                        {coupleInfo ? coupleInfo.nickname : "Loading..."}
                    </span>
                    </h4>
                    <Col
                        md={6}
                        className="calendar-column d-flex flex-column justify-content-between"
                        style={{ position: "relative" }}
                    >
                    

                        {/* 검색창과 돋보기 아이콘을 함께 묶은 박스 */}
                        <div className="search-container d-flex align-items-center justify-content-end mb-3">
                            <Form.Control
                                type="text"
                                placeholder="데이트 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="calendar__search-input me-2"
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        console.log(e.key);
                                        handleSearch();
                                    }
                                }}
                            />
                            <FaSearch
                                className="search-icon"
                                onClick={handleSearch}
                                // onClick={() => setShowSearch(!showSearch)}
                            />
                        </div>
                        <div>
                            {matchedDates.length > 0 && (
                                <div className="search-navigation d-flex justify-content-end mb-3 me-4">
                                    <ArrowLeft onClick={goToPrevMatch} />

                                    <span className="mx-2">
                                        검색된 날짜 {currentMatchIndex + 1}/
                                        {matchedDates.length}
                                    </span>
                                    <ArrowRight onClick={goToNextMatch} />
                                </div>
                            )}
                        </div>

                        <Cal
                            onChange={(value) => {
                                setSelectedDate(value);
                                // 사용자가 직접 날짜 선택 시 searchSelectedDate 초기화
                                setSearchSelectedDate(null);
                            }}
                            value={selectedDate}
                            onClickDay={(value) => {
                                setSelectedDate(value);
                                setSearchSelectedDate(null);
                            }}
                            onActiveStartDateChange={
                                handleActiveStartDateChange
                            }
                            className="couple-calendar flex-grow-1"
                            tileContent={tileContent}
                        />
                    </Col>

                    {/* 오른쪽 방문지 리스트 */}
                    <Col md={6} className="places-column">
                        {userInfo ? (
                            userInfo.coupleStatus === 0 ? (
                                <div className="muted-overlay">
                                    <div className="muted-message text-center">
                                        <h6>
                                            캘린더를 이용하려면 커플 연결을
                                            해야합니다 :(
                                        </h6>
                                        <Link to="/connect-couple">
                                            <button className="mt-3 couple-btn">
                                                커플 연동하기
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                selectedDate && (
                                    <>
                                        <h4 className="today-date-title">
                                            <b>
                                            {selectedDate.getMonth() + 1}월{" "}
                                            {selectedDate.getDate()}일
                                            </b>
                                            
                                        </h4>
                                        <div className="d-flex align-items-center mb-3">
                                            <h5>방문지 리스트</h5>
                                            <Link
                                                to="/map"
                                                state={{
                                                    selectedDate: selectedDate,
                                                }}
                                            >
                                                <Button
                                                    variant="outline-success"
                                                    className="ms-3 border-0"
                                                >
                                                    지도 보기 🗺️
                                                </Button>
                                            </Link>
                                        </div>

                                        {/* 장소 리스트 렌더링 */}
                                        <DragDropContext onDragEnd={onDragEnd}>
                                            <Droppable droppableId="placesList">
                                                {(provided) => (
                                                    <ul
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        className="list-unstyled"
                                                    >
                                                        {places?.map(
                                                            (place, i) => (
                                                                <Draggable
                                                                    key={
                                                                        place.placeId
                                                                    }
                                                                    draggableId={String(
                                                                        place.placeId
                                                                    )}
                                                                    index={i}
                                                                >
                                                                    {(
                                                                        provided
                                                                    ) => (
                                                                        <li
                                                                            ref={
                                                                                provided.innerRef
                                                                            }
                                                                            {...provided.draggableProps}
                                                                            className="list-group-item d-flex align-items-center"
                                                                        >
                                                                            <span
                                                                                {...provided.dragHandleProps}
                                                                                className="me-2 p-1"
                                                                                style={{
                                                                                    cursor: "grab",
                                                                                }}
                                                                            >
                                                                                ☰{" "}
                                                                                {i +
                                                                                    1}

                                                                                .
                                                                            </span>
                                                                            {editId ===
                                                                            place.placeId ? (
                                                                                <input
                                                                                    type="text"
                                                                                    value={
                                                                                        editText
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        setEditText(
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                    onBlur={() => {
                                                                                        editPlace(
                                                                                            place.placeId,
                                                                                            editText
                                                                                        );
                                                                                        setEditId(
                                                                                            null
                                                                                        );
                                                                                    }}
                                                                                    onKeyPress={(
                                                                                        e
                                                                                    ) => {
                                                                                        if (
                                                                                            e.key ===
                                                                                            "Enter"
                                                                                        ) {
                                                                                            editPlace(
                                                                                                place.placeId,
                                                                                                editText
                                                                                            );
                                                                                            setEditId(
                                                                                                null
                                                                                            );
                                                                                        }
                                                                                    }}
                                                                                    autoFocus
                                                                                />
                                                                            ) : (
                                                                                <span className="me-2 p-1">
                                                                                    {highlightText(
                                                                                        place.placeName,
                                                                                        searchWord
                                                                                    )}
                                                                                </span>
                                                                            )}
                                                                            {/* 상세보기 버튼 추가 */}
                                                                            <Button
                                                                                variant="outline-secondary"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleShowDetails(
                                                                                        place.placeId
                                                                                    )
                                                                                }
                                                                                className="me-2"
                                                                            >
                                                                                상세보기
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline-danger"
                                                                                size="sm"
                                                                                className="ms-auto"
                                                                                onClick={() =>
                                                                                    deletePlace(
                                                                                        place.placeId
                                                                                    )
                                                                                }
                                                                            >
                                                                                ✕
                                                                            </Button>
                                                                        </li>
                                                                    )}
                                                                </Draggable>
                                                            )
                                                        )}
                                                        {provided.placeholder}
                                                    </ul>
                                                )}
                                            </Droppable>
                                        </DragDropContext>

                                        {/* 장소 추가 버튼 (장소가 7개 미만일 때만 표시) */}
                                        {places?.length < 6 ? (
                                            showInput ? (
                                                <div className="mt-2 d-flex align-items-center">
                                                    {/* 자동완성 input + dropdown */}
                                                    <div
                                                        style={{
                                                            position:
                                                                "relative",
                                                            display:
                                                                "inline-block",
                                                        }}
                                                        ref={containerRef}
                                                    >
                                                        <input
                                                            autoFocus
                                                            ref={inputRef}
                                                            type="text"
                                                            value={newPlace}
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                            placeholder="장소 입력"
                                                            className="form-control w-auto me-2"
                                                            onKeyPress={
                                                                handleKeyPress
                                                            }
                                                        />
                                                        {showDropdown &&
                                                            filteredPlaces.length >
                                                                0 && (
                                                                <ul
                                                                    className="dropdown-menu show"
                                                                    style={{
                                                                        position:
                                                                            "absolute",
                                                                        top: "100%",
                                                                        left: 0,
                                                                        width: "100%",
                                                                        maxHeight:
                                                                            "350px",
                                                                        overflow:
                                                                            "auto",
                                                                        zIndex: 1000,
                                                                        border: "1px solid #ccc",
                                                                        backgroundColor:
                                                                            "#fff",
                                                                    }}
                                                                >
                                                                    {filteredPlaces.map(
                                                                        (
                                                                            place,
                                                                            index
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                <button
                                                                                    type="button"
                                                                                    className="dropdown-item"
                                                                                    onClick={() =>
                                                                                        handleSelectPlace(
                                                                                            place
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        place.placeName
                                                                                    }
                                                                                </button>
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            )}
                                                    </div>
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() =>
                                                            setShowInput(false)
                                                        }
                                                    >
                                                        취소
                                                    </button>
                                                </div>
                                            ) : places?.length < 6 ||
                                              places?.length === undefined ? (
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setShowInput(true);
                                                    }}
                                                >
                                                    + 방문지를 추가하세요 :)
                                                </a>
                                            ) : (
                                                <span className="text-muted">
                                                    방문지는 6개까지만 입력
                                                    가능합니다 :)
                                                </span>
                                            )
                                        ) : (
                                            <span className="text-muted">
                                                방문지는 6개까지만 입력
                                                가능합니다 :)
                                            </span>
                                        )}

                                        <hr />
                                        <span style={{ display: "block", height: "7px" }}></span>


                                        {selectedDate <= today ? (
                                            <>
                                                <Diary
                                                    diary={diary}
                                                    editDiary={editDiary}
                                                    setEditDiary={setEditDiary}
                                                    coupleInfo={coupleInfo}
                                                    diaryEntry={diaryEntry}
                                                    saveDiary={saveDiary}
                                                    diaryText={diaryText}
                                                    yourDiaryText={
                                                        yourDiaryText
                                                    }
                                                    setDiaryText={setDiaryText}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <Row>
                                                    <Col>
                                                        <h6>
                                                            <b>
                                                                지난번 이곳은 어떠셨나요?
                                                            </b>
                                                        </h6>
                                                        <ul className="list-group mb-3">
                                                            {lastVisitPlace.map(
                                                                (
                                                                    place,
                                                                    index
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="prev-list-group-item"
                                                                    >• {" "}
                                                                        {
                                                                            place.placeName
                                                                        }
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </Col>
                                                    <Col>
                                                    <Col>
  <h6 className="mb-3">
    <strong>이날은 여기서 놀아볼까요?</strong>
  </h6>
  
    <Card
    className="shadow-sm border-0"
    style={{
      borderRadius: '12px',
      overflow: 'hidden',
      maxWidth: '300px', // 카드 폭을 제한합니다.
      margin: '0 auto'  // 중앙 정렬
    }}
  >
    {loading ?(
        <div className="loading-container">
        <Spinner animation="border" variant="danger" />
        <p>추천 장소를 불러오는 중...</p>
    </div> ):(
    <div style={{ position: 'relative' }}>
      <Card.Img
        variant="top"
        src={recommendations.IMAGE || recommendations.image}
        style={{ height: '200px', objectFit: 'cover', cursor:"pointer" }}
        onClick={()=>{window.location.href = `/place?id=${recommendations.PLACE_ID}`}}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
          padding: '8px 12px'
        }}
      >
        <Card.Title className="mb-0" style={{ color: '#fff', fontSize: '16px', cursor:"pointer" }}
        onClick={()=>{window.location.href = `/place?id=${recommendations.PLACE_ID}`}}>
          {recommendations.PLACE_NAME || recommendations.place_name}
        </Card.Title>
      </div>
    </div>

  )}
  </Card>
 
  
</Col>

</Col>
                                                </Row>
                                            </>
                                        )}
                                    </>
                                )
                            )
                        ) : (
                            "Loading..."
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Calendar;
