import { useState, useEffect } from "react";
import { Card, Row, Col, Image } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Chart.js 자동 불러오기

const WeatherCard = () => {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch("http://localhost:8586/api/weather/today");
                const data = await response.json();

                if (data.response.body.items.item) {
                    const items = data.response.body.items.item;

                    // 현재 시간 가져오기
                    const now = new Date();
                    const currentHour = now.getHours();

                    // 2시간 단위로 5개 시간 생성
                    let hourlyTimes = [];
                    let hourlyTemps = [];
                    for (let i = 0; i < 5; i++) {
                        const hour = (currentHour + i * 2) % 24; // 24시간 형식 유지
                        const formattedHour = `${hour.toString().padStart(2, "0")}시`;
                        hourlyTimes.push(formattedHour);

                        // 해당 시간대의 기온 데이터 찾기
                        const tempItem = items.find(i => i.category === "TMP" && parseInt(i.fcstTime.substring(0, 2)) === hour);
                        hourlyTemps.push(tempItem ? tempItem.fcstValue : "N/A");
                    }

                    const weatherData = {
                        temperature: items.find(i => i.category === "TMP")?.fcstValue || "N/A",
                        minTemp: items.find(i => i.category === "TMN")?.fcstValue || "N/A",
                        maxTemp: items.find(i => i.category === "TMX")?.fcstValue || "N/A",
                        fineDust: "보통",
                        ultraFineDust: "보통",
                        condition: getWeatherCondition(
                            items.find(i => i.category === "PTY")?.fcstValue,
                            items.find(i => i.category === "SKY")?.fcstValue
                        ),
                        icon: getWeatherIcon(
                            items.find(i => i.category === "PTY")?.fcstValue,
                            items.find(i => i.category === "SKY")?.fcstValue
                        ),
                        hourlyData: hourlyTimes.map((time, index) => {
                            const hourlyCondition = items.find(i => i.category === "PTY" && parseInt(i.fcstTime.substring(0, 2)) === parseInt(time));
                            const hourlySky = items.find(i => i.category === "SKY" && parseInt(i.fcstTime.substring(0, 2)) === parseInt(time));

                            return {
                                time,
                                temp: hourlyTemps[index],
                                icon: getWeatherIcon(hourlyCondition?.fcstValue || "0", hourlySky?.fcstValue || "1") // 기본값 맑음
                            };
                        })
                    };

                    setWeather(weatherData);
                }
            } catch (error) {
                console.error("날씨 정보를 불러오는 데 실패했습니다.", error);
            }
        };

        fetchWeather();
    }, []);

    if (!weather) return <p className="text-center text-muted">날씨 정보를 불러오는 중...</p>;

    return (
        <Card className="mx-auto shadow-sm rounded-4 p-3 text-center" style={{ width: "300px" }}>
            {/* 제목 */}
            <b>오늘 날씨</b>

            {/* 현재 날씨 아이콘과 기온 */}
            <Image src={weather.icon} alt={weather.condition} width={70} className="mx-auto" />
            <h2 className="fw-bold">{weather.temperature}°</h2>
            <p className="text-muted">{weather.condition}</p>

            {/* 최저/최고 기온 */}
            <p className="text-muted">
                <span className="text-primary">{weather.minTemp}°</span> /
                <span className="text-danger"> {weather.maxTemp}°</span>
            </p>

            {/* 미세먼지 정보 */}
            <p>
                미세 <span className="text-success fw-bold">{weather.fineDust}</span> ·
                초미세 <span className="text-success fw-bold">{weather.ultraFineDust}</span>
            </p>

            {/* 시간별 기온 그래프 */}
            <div className="mt-4">
                <WeatherGraph hourlyData={weather.hourlyData} />
            </div>
        </Card>
    );
};

// 시간별 기온 그래프 컴포넌트
const WeatherGraph = ({ hourlyData }) => {
    const temperatures = hourlyData.map(data => (data.temp !== "N/A" ? parseFloat(data.temp) : null));

    const data = {
        labels: hourlyData.map(data => data.time),
        datasets: [
            {
                label: "기온 (°C)",
                data: temperatures,
                fill: false,
                borderColor: "#007bff", // 파란색 선
                tension: 0.4,
                pointBackgroundColor: "#007bff",
                pointBorderColor: "#fff",
                pointRadius: 4, // 점 크기 조정
                borderWidth: 2 // 선 굵기 조정
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: "#E0E0E0", // 연한 회색 수직선
                    lineWidth: 1
                },
                ticks: {
                    display: false
                }
            },
            y: { display: false }
        }
    };

    return (
        <div className="w-100">
            <Line data={data} options={options} />
            <Row 
                className="justify-content-between mt-2"
                style={{ display: "flex", alignItems: "center", flexWrap: "nowrap", textAlign: "center" }}
            >
                {hourlyData.map((data, index) => (
                    <Col key={index} className="text-center" style={{ flex: 1, padding: "0 5px" }}>
                        <p className="small text-muted" style={{ marginBottom: "2px", fontSize: "12px" }}>
                            {data.temp !== "N/A" ? `${data.temp}°` : "--"}
                        </p>
                        <Image src={data.icon} width={30} />
                        <p className="small text-muted" style={{ fontSize: "12px", marginTop: "2px" }}>{data.time}</p>
                    </Col>
                ))}
            </Row>
        </div>
    );
};




// 날씨 상태 변환 함수 (PTY + SKY 반영)
const getWeatherCondition = (pty, sky) => {
    if (pty === "1") return "비";
    if (pty === "2") return "비/눈";
    if (pty === "3") return "눈";
    if (pty === "4") return "소나기";

    if (sky === "1") return "맑음";
    if (sky === "3") return "구름 많음";
    if (sky === "4") return "흐림";

    return "알 수 없음";
};

// 날씨 아이콘 변환 함수 (PTY + SKY 반영)
const getWeatherIcon = (pty, sky) => {
    const icons = {
        "맑음": "https://cdn-icons-png.flaticon.com/512/869/869869.png",
        "구름 많음": "https://cdn-icons-png.flaticon.com/512/414/414927.png", // ☁️ 밝은 구름 (변경됨)
        "흐림": "https://cdn-icons-png.flaticon.com/512/1163/1163624.png",
        "비": "https://cdn-icons-png.flaticon.com/512/414/414974.png",
        "비/눈": "https://cdn-icons-png.flaticon.com/512/1779/1779907.png",
        "눈": "https://cdn-icons-png.flaticon.com/512/2315/2315309.png",
        "소나기": "https://cdn-icons-png.flaticon.com/512/1779/1779907.png" // 🌦️ 비 내리는 구름 (변경됨)
    };

    const condition = getWeatherCondition(pty, sky);
    return icons[condition] || icons["흐림"];
};


export default WeatherCard;
