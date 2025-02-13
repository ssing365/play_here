package com.playhere.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

@Service
public class KakaoService {
	public String getKakaoUserId(String accessToken) {
        String reqURL = "https://kapi.kakao.com/v2/user/me";
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(reqURL))
                .header("Authorization", "Bearer " + accessToken)
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // ✅ JSON 파싱 (사용자 ID 추출)
            JSONObject json = new JSONObject(response.body());
            return json.getString("id");

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}
