package com.playhere;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    @GetMapping("/today")
    public ResponseEntity<String> getTodayWeather() {
        String weatherData = "";
        try {
            String apiKey = "Bm6eKdiRSgb3O2AXfTZSVIExh5YwMimrsxV0VKLjHbooj4i%2FzwE8dS1jSrPw7rMeQeb%2Bp%2Bif6DwvvOJo42NAKw%3D%3D"; // 실제 API 키 사용

            // 현재 날짜 및 단기예보 발표 시간 설정 (TMN, TMX는 0500 이후)
            String baseDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String baseTime = "0500"; // 최저/최고 기온을 포함하는 시간으로 고정

            // API 요청 URL
            String urlString = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst" +
                    "?serviceKey=" + apiKey + 
                    "&pageNo=1" + 
                    "&numOfRows=1000" +  
                    "&dataType=JSON" + 
                    "&base_date=" + baseDate +  
                    "&base_time=" + baseTime +  
                    "&nx=60&ny=127";  // 서울 기준 좌표

            System.out.println("API 요청 URL: " + urlString); // 요청 URL 확인용 로그

            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = reader.readLine()) != null) {
                response.append(inputLine);
            }
            reader.close();
            weatherData = response.toString();

            // 로그로 응답 데이터 확인
            System.out.println("API 응답 데이터: " + weatherData);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("날씨 데이터를 가져오는 중 오류 발생");
        }
        return ResponseEntity.ok(weatherData);
    }
}
