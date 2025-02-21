package com.playhere.restapi;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommend")
public class RecommendController {

    private final String FASTAPI_URL = "http://127.0.0.1:8000/api/recommend/";

    @GetMapping("/{userId}")
    public ResponseEntity<?> getRecommendations(@PathVariable String userId) {
        RestTemplate restTemplate = new RestTemplate();

        // FastAPI로 GET 요청 보내기
        String requestUrl = FASTAPI_URL + userId;
        ResponseEntity<List> response = restTemplate.exchange(
                requestUrl, HttpMethod.GET, null, List.class
        );

        // FastAPI 응답 반환
        return ResponseEntity.ok(response.getBody());
    }
}
