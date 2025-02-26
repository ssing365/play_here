import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import Top5 from "../components/Main/Top5"
import WeatherCard from "../components/Main/WeatherCard"; // WeatherCard 추가
import '../index.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import { useContext } from "react";
import { UserContext } from '../contexts/UserContext';

const Search = () => {
    // 카테고리 default
    const [selectedCategory, setSelectedCategory] = useState('식당 & 카페');

    
    // 행사 정보
    const [festiv, setFestiv]= useState([])
    // context에서 로그인 상태, 유저 정보 가져오기
    const { userInfo, isLoggedIn } = useContext(UserContext);

    // 주간 날짜 뽑기

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekDates, setWeekDates] = useState([]);   //일주일 날짜
    const [loading, setLoading] = useState(true);
   
    //공연 전시 정보 저장
    const [selectedPlaceId, setSelectedPlaceId]= useState([]);

    
    const sendUrl= `http://localhost:8586/api/events`
    //백 연결

    //장소 아이디 목록
    useEffect(() => {
        fetch("http://localhost:8586/api/events") // placeId를 제공하는 API 엔드포인트
        .then(res => res.json())
        .then(data => {
            const ids = data.map(place => place.id);
            setSelectedPlaceId(ids);
            console.log("가져온 placeIds:", ids);
        })
        .catch(err => {
            console.error("Error fetching place IDs:", err);
            setLoading(false);
        });
    }, []);
    useEffect(() => {
        fetch(`http://localhost:8586/api/events?placeId=${selectedPlaceId.join(',')}`)
        .then(res => res.json())
        .then(data => {
            console.log('from 백', data); 
            const ids = data.map(place => place.id);  // id만 추출
            setSelectedPlaceId(ids);  // 상태 저장
            console.log("가져온 placeIds:", ids);
        })
        }, []);

    // useEffect(() => {
    //         setLoading(true);
    //         fetch("http://localhost:8586/api/events") // placeId를 제공하는 API 엔드포인트
    //         .then(res => res.json())
    //         .then(data => {
    //             const ids = data.map(place => place.id);
    //             setSelectedPlaceId(ids);
    //             console.log("가져온 placeIds:", ids);
    //             // placeId에 맞는 이벤트를 가져오는 요청
    //             return fetch(`http://localhost:8586/api/events?placeId=${ids.join('&placeId=')}`);
    //         })
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log('from 백', data);
    //             setFestiv(data);  // 행사 데이터를 받으면 저장
    //             setLoading(false);
    //         })
    //         .catch(err => {
    //             console.error("Error fetching place IDs or events:", err);
    //             setLoading(false);
    //         });
    //     }, []);
        
    
        // const addPlaceId = (newId) => {
        //     setSelectedPlaceId((prev) => {
        //         if (!prev.includes(newId)) {
        //             return [...prev, newId]; // 중복 방지
        //         }
        //         return prev;
        //     });
        // };
    // useEffect(() =>{
        // const fetchEvents = async () => {
            // try {
                //     const response = await axios.get(`http://localhost:8586/api/events/${selectedPlaceId}`);
                //     // `http://localhost:8586/api/events/${selectedPlaceId}`);
                //     //   const data = await response.json();
                //     console.log(`🎯 요청한 ID: ${selectedPlaceId}`);
                
                //     const uniqueEvents = Array.from(new Set(response.data.map(event => JSON.stringify(event))))
                //                                       .map(str => JSON.parse(str));
                
                //             setFestiv(uniqueEvents);
                //             setLoading(false);  //   
                // } catch (error) {
                    
                //         console.log("오류에여");
                //         setLoading(false);
                //     }
                // };
                
                //     if(selectedPlaceId){
                    //         console.log(`🔄 fetchEvents 실행! selectedPlaceId: ${selectedPlaceId}`);
                    //         fetchEvents();
                    //     } } , [selectedPlaceId]);
                    
    // //일주일 날짜 생성
    useEffect(() => {  
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {

        const day = new Date(today);
        day.setDate(today.getDate() + i);
        dates.push(day);
    }

    setWeekDates(dates);
    setSelectedDate(dates[0]);  // 오늘 날짜를 기본으로 설정
        
    }, []);
    // 배열로 받아오는지 
// useEffect(()=>{ 
//     console.log("Update",Array.isArray(festiv), festiv);
// }, [festiv]);
useEffect(()=>{ 
    console.log("Update", selectedPlaceId);
}, [selectedPlaceId]);
   
// // 날짜를 기준으로 [이벤트 ]필터링  기간 사이에 존재하면 반환 
const filterEventsByDate = ( selectedDate) => {
    // const days= weekDates.some(weekDate=>{
    //     const weekDay= new Date(weekDate);
    //     weekDay.setHours(0,0,0,0);
    //     return weekDay.getTime() === festiv.time;
    // });
    // if (!days) return [];
    return festiv.filter(eventDate => {
        // 날짜 형식을 YYYY-MM-DD로 변환하여 비교
        if(!eventDate.time) return console.log('시간이 존재x')
        console.log("timmme ", eventDate.time);
        const [startDate, endDate]=eventDate[0].time.split(' ~ ');
        // const [startDate, endDate]=eventDate.time.split(' ~ ').map(dateStr => new Date(dateStr.trim()));
        
        //yyyy-mm-dd
        // const startDate = new Date(startStr.replace(/\./g, '-'));
        // const endDate = new Date(endStr.replace(/\./g, '-'));
        // const targetDate= new Date(date.setHours(0,0,0,0));    굳이?
        //시간 초기화
        
        // return selectedDate.getTime() >= startDate.getTime() && selectedDate.getTime() <= endDate.getTime();
        return selectedDate >= startDate && selectedDate <= endDate;
      
    });
};
// console.log('q',festiv[0].time)/
// // // 선택된 날짜에 해당하는 이벤트 필터링 하여 저장
// const filteredEvents =  weekDates.map(date => filterEventsByDate(date)).flat();
// console.log(filteredEvents);

const filteredEvents = useMemo(()=>filterEventsByDate(), [selectedDate, weekDates])
  const handleDateClick = (date) => {
    setSelectedDate(date);
      };

      //받아온 값없을 경우 로딩창.
  if( loading){
    return <div className="text-center p-4">load..</div>;
  }

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* 상단바 */}
            <TopBar />
            
            {/* 메인 컨테이너 */}
            <Container className="mt-5 mb-5">
                {/* 지금 가기 좋은 곳 */}
                {isLoggedIn ? (
                        <h4 style={{ fontWeight: 'bold', color: '#000000', marginTop: '20px' }}>
                        {userInfo?.nickname || "Loading..."} 님을 위한 추천 </h4>
                    ):(
                        <h4 style={{ fontWeight: 'bold', color: '#000000', marginTop: '20px' }}>
                        지금 가기 좋은 곳 </h4>
                    )}
                <div className="d-flex gap-3 mb-3">
                    {['식당 & 카페', '가볼만한 곳', '축제, 공연'].map((category) => (
                        <Button 
                            key={category} 
                            variant={selectedCategory === category ? 'dark' : 'outline-dark'} 
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </Button>
                    ))}
                    {/* if(selectedCategory='축제, 공연') */}
                </div>
               
                <Row className="mb-5"> 
                <div className="grid grid-cols-7 gap-4 mb-8">
                        {weekDates.map((date) => (
                        <Card 
                            key={date.toString()} 
                            className={`min-h-48 cursor-pointer ${
                            selectedDate && date.toDateString() === selectedDate.toLocaleDateString() 
                                ? 'border-2 border-blue-500' 
                                : ''
                            }`}
                            onClick={() => handleDateClick(date)}
                        >
                        </Card>
                       
                   ))} 
                   </div>
                        </Row>
                {/* 중간 섹션 : 큐레이션, 큰 사진 슬라이드*/}
                <Top5/>

                {/* 주간 달력과 날씨 */}
                <Row className="mt-5">
                    {/* 행사 목록 (좌측 9칸) */}
                    <Col md={9}>
                        <h5><strong>이번 주 행사</strong></h5>
                        <div className="d-flex justify-content-between mb-2" style={{backgroundColor:"#FFC7C7", borderRadius:"10px", }}>
                            {weekDates.map((dateObj , index) => {
                                return (
                                    <div key={index}  className="text-center">
                                        {/* <p>{festiv.map}</p> */}
                                        <div
                                            className="p-2 mt-1 mb-1 ms-1 me-1 d-flex align-items-center justify-content-center"
                                            style={{
                                                backgroundColor: selectedDate.getDate() === dateObj.getDate() ? "#f6f6f6" : "transparent",
                                                borderRadius: "50%",
                                                width: "30px",
                                                height: "30px",
                                                cursor: "pointer",
                                                border: selectedDate.getDate() === dateObj.getDate() ? "1px solid #f6f6f6" : "none",
                                                fontSize: "14px"
                                            }}
                                            
                                            onClick={() => setSelectedDate(dateObj)  }
                                        >
                                            {dateObj.getDate()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* event 안에  장소정보 저장되어( db에서 가져온)|| */}
                        <Row className="mt-5">
                            {filteredEvents.map((event, index) => {
                                if(!event.time) {
                                    console.log('시간 ',event.time);
                                }
                                const [startDate, endDate]=event.time.split('~');
                                

                                const selectedDateCopy = weekDates.some(weekDate=>{
                                    const targetDate= new Date(weekDate);
                                    targetDate.setHours(0, 0, 0, 0);
                                return targetDate >=new Date(startDate) && targetDate <=new Date(endDate);
                            });
                            if( !selectedDateCopy) return null;

                                return (
                                    // (festiv.length >0)
                                <Col md={12} key={index} className="d-flex align-items-center mb-3">
                                    {console.log("tiem", event)}
                                    <a href={event.link} target="children"rel="noopener noreferrer">
                                    <img 
                                        src={event.image || "/default-image.jpg"}
                                        // alt={item.name} 
                                        className="rounded"
                                        style={{ objectFit: 'cover', width: '150px', height: '150px' }} 
                                        // onClick={() => window.open(event.링크)} // 이미지 클릭시 링크 이동
                                        />
                                        </a>
                                    <div className="ms-3">
                                        {/* <span>{event.카테고리}</span> */}
                                        <h5>{event.placeName}</h5>
                                        <p>{event.location}</p>
                                        <p>{event.description}</p>
                                      </div>
                                  </Col>
                          
                        );
                    })}
                            
                            {festiv.length == 0&& (
                                <Col md={12} ><p>예정된 행사 없음</p></Col>
                            )}
                            
                            <div className="d-flex justify-content-between mb-2" style={{backgroundColor:"#FFC7C7", borderRadius:"10px"}}></div>
                                {/* {festiv.length > 0 ? (
                                                             <ul>
                                    {festiv.map((fest, index) => {
                                        console.log("이벤트",fest)
                                        return(
                                        <Col md={8} key={index} className="d-flex align-items-center mb-3 border-bottom pb-3">
                                           <a href={fest.link}> <img src={fest.image}
                                              /> </a>
                                                 <h3><small>{fest.placeName || "no name"}</small></h3>
                                                <p>{fest.description}</p> 
                                                <p>기간: {fest.time}</p>
                                                <p>장소: {fest.location}</p>
                                            </Col>
                                        );
                                        })} 
                                    </ul>
                                    
                                ) : (
                                    <p>예정된 축제가 없습니다.</p>
                                )} */}
                             {/* {selectedDate && filterEventsByDate(selectedDate).map((event, index) => (
                            <Col md={12} key={index} className="d-flex align-items-center mb-3">
                            <a href={event.homepage} target="_blank" rel="noopener noreferrer">
                                <img 
                                src={event.image || "/default-image.jpg"}  //없으면 기본 이미지
                                alt={event.title} 
                                className="rounded"
                                style={{ objectFit: 'cover', width: '150px', height: '150px' }} 
                                />
                            </a>
                            <div className="ms-3">
                               21:전시   22:공연 */}
                               {/* <span>{event.type === 'PERFORMANCE' ? '공연' : '전시'}</span>
                                <h5>{event.title}</h5>
                                <p>{event.descript}</p>
                                <p>{event.date}</p>
                          </div>
                            </Col> 
                        ))}  */}
                        {/* {selectedDate && filterEventsByDate(selectedDate).length === 0 && (
                            <Col md={12}><p>예정된 행사 없음</p></Col>
                        )} */}
                         </Row>
                        
                    </Col>

                    {/* 날씨 카드 추가 (우측 3칸) */}
                    <Col md={3} className="d-flex justify-content-end">
                        <div className="d-flex justify-content-between mb-2"></div>
                        <WeatherCard />
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Search;
