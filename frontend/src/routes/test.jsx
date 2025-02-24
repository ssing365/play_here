import { useState, useEffect } from "react";
 
const test() =>{

const fetchEvents = async () => {
    try {
        const response = await fetch("https://apis.data.go.kr/B553457/nopenapi/rest/publicperformancedisplays/realm?serviceKey=I7QtdjHoQSkNqwd0uRHZ9EXmz%2Fp6bOWwzlp2ny1VEzoI5FZJZaRgAroATtkXzV5sEoqSLQtEXFbsx%2BtIkGFLSw%3D%3D&PageNo=1&numOfrows=10&sido=%EC%84%9C%EC%9A%B8&from=20181029&to=20251231&place=%EA%B5%AD%EB%A6%BD%EC%A4%91%EC%95%99%EB%8F%84%EC%84%9C%EA%B4%80&gpsxfrom=127.00298547116853&gpsyfrom=37.49761794050167&gpsxto=127.00298547116853&gpsyto=37.49761794050167&keyword=%EA%B5%AD%EB%A6%BD%EC%A4%91%EC%95%99%EB%8F%84%EC%84%9C%EA%B4%80&sortStdr=1&realmCode=D000&serviceTp=A"); // 여기에 실제 API 주소 입력
        const text = await response.text(); // XML 데이터를 텍스트로 가져오기
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");

        // XML 데이터에서 필요한 정보 추출
        const items = Array.from(xml.getElementsByTagName("item")).map(item => ({
            title: item.getElementsByTagName("title")[0]?.textContent || "",
            from: item.getElementsByTagName("startDate")[0]?.textContent || "",
            to: item.getElementsByTagName("endDate")[0]?.textContent || "",
            place: item.getElementsByTagName("place")[0]?.textContent || "",
            카테고리: item.getElementsByTagName("realmName")[0]?.textContent || "",
            지역: item.getElementsByTagName("area")[0]?.textContent || "",
            썸네일: item.getElementsByTagName("thumbnail")[0]?.textContent || "", //이미ㅈ
            위도: item.getElementsByTagName("gpsY")[0]?.textContent || "",
            경도: item.getElementsByTagName("gpsX")[0]?.textContent || ""
        })
      );

        return items;
    } catch (error) {
        console.error("데이터 가져오기 실패", error);
        return [];
    }
};
}
export default function Events() {


  const [event, setEvent]=useState([]);

  useEffect(( )=>{
    const loadData= async ()=>{{
      const data= await fetchEvents();
      setEvent(data);
    };
  loadData();}},
  [] );
  

return(<>
   <h2>행사 목록</h2>
            {event.length === 0 ? <p>데이터 없음</p> : (
                event.map((event, index) => (
                    <div key={index} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
                        <h3>{event.제목}</h3>
                        <p>{event.시작일} ~ {event.종료일}</p>
                        <p>장소: {event.장소} ({event.지역})</p>
                        {event.썸네일 && <img src={event.썸네일} alt="썸네일" style={{ width: "150px" }} />}
                    </div>
                ))
            )}
  </>)
}
