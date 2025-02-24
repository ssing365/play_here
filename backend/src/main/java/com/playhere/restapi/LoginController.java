package com.playhere.restapi;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import com.playhere.member.IMemberService;
import com.playhere.member.MemberDTO;
import com.playhere.util.JwtUtil;

import io.jsonwebtoken.Claims;

@RestController
@RequestMapping("/api")
public class LoginController {
	@Autowired
	IMemberService dao;
	
	@Autowired
    JwtUtil jwtUtil;
	
//	로그인
	@PostMapping("/login")
	public  ResponseEntity<Map<String, Object>> login(@RequestBody MemberDTO member, HttpServletResponse response) {
		System.out.println("[백엔드] 로그인 API 호출됨");
		System.out.println("요청 받은 userId: " + member.getUserId());
	    System.out.println("요청 받은 password: " + member.getPassword());

	    // 유저 인증하기 
	    MemberDTO user = dao.login(member.getUserId(), member.getPassword());
	    
	    if (user == null) {
            System.out.println("[백엔드] 로그인 실패");
            return ResponseEntity.status(401).body(Map.of("message", "아이디 또는 비밀번호가 올바르지 않습니다."));
        }
	    // account_status 확인 로그 추가
	    System.out.println("[디버깅] userId: " + user.getUserId() + ", account_status: " + user.getAccountStatus());
	    
	    // 2. 탈퇴한 회원인지 확인 (`account_status == 0`이면 로그인 차단)
	    if (user.getAccountStatus() == 0) {
	        System.out.println("[백엔드] 로그인 실패: 탈퇴한 회원");
	        return ResponseEntity.status(403).body(Map.of("message", "이 계정은 탈퇴한 회원입니다. 로그인할 수 없습니다."));
	    }
	    
	    System.out.println("[백엔드] 로그인 성공");
	    System.out.println("[디버깅] coupleStatus"+user.getCoupleStatus());
	    // 커플 상태 확인
        String alertMessage = null;
        if (user.getCoupleStatus() == 2) {
            alertMessage = "⚠️ 상대방이 커플을 끊었습니다.";
            dao.updateCoupleStatus2to0(user.getUserId()); // 상태 초기화
        }
		
		// ✅ JWT 토큰 생성
        String jwt = jwtUtil.generateToken(member.getUserId());
        System.out.println("[백엔드] 발급된 JWT: " + jwt);
        // ✅ HttpOnly 쿠키에 저장
        Cookie cookie = new Cookie("token", jwt);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60); // 1시간
        cookie.setSecure(false); // 🚨 로컬 개발 환경에서는 false
        //cookie.setDomain("localhost"); // 필요 시 추가
        response.addCookie(cookie);
        
        // 5️. 응답 데이터 구성
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("message", alertMessage);
        responseData.put("userId", user.getUserId());
        responseData.put("coupleStatus", user.getCoupleStatus());

        return ResponseEntity.ok(responseData);
		
	}
	
//	로그아웃
	@PostMapping("/logout")
	public ResponseEntity<String> logout(HttpServletResponse response) {
	    // 토큰 쿠키 삭제 (만료 시간을 과거로 설정)
	    Cookie cookie = new Cookie("token", null);
	    System.out.println(cookie);
	    cookie.setHttpOnly(true);
	    cookie.setPath("/");
	    cookie.setMaxAge(0); // 쿠키 즉시 만료
	    response.addCookie(cookie);
	    
	    return ResponseEntity.ok("logout success");
	}
	
	@PostMapping("/naver-login")
	public ResponseEntity<String> naverLogin(@RequestBody Map<String, String> request, HttpServletResponse httpResponse) {
        String code = request.get("code");
        System.out.println("code : " + code);
        
        /* ✅ 1. 네이버 토큰 요청
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", "Hro8hpVJMXD3cfsDlUr1"); // 네이버 클라이언트 ID
        params.add("client_secret", "YOUR_NAVER_CLIENT_SECRET"); // 네이버 클라이언트 시크릿
        params.add("code", code);
        params.add("state", "false"); 

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);
        ResponseEntity<Map> tokenResponse = restTemplate.exchange(
            "https://nid.naver.com/oauth2.0/token",
            HttpMethod.POST,
            entity,
            Map.class
        );

        if (!tokenResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(500).body("네이버 토큰 요청 실패");
        }

        String accessToken = (String) tokenResponse.getBody().get("access_token");

        // ✅ 2. 네이버 사용자 정보 요청
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<String> profileEntity = new HttpEntity<>(headers);
        ResponseEntity<Map> profileResponse = restTemplate.exchange(
            "https://openapi.naver.com/v1/nid/me",
            HttpMethod.GET,
            profileEntity,
            Map.class
        );

        if (!profileResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(500).body("네이버 사용자 정보 요청 실패");
        }

        Map<String, Object> response = (Map<String, Object>) profileResponse.getBody().get("response");
        String userId = (String) response.get("id");
        String nickname = (String) response.get("nickname");
        String email = (String) response.get("email");
        */

        // ✅ JWT 토큰 발급
        String jwt = jwtUtil.generateToken(code);
        System.out.println("jwt token : " + jwt);

        /* ✅ 클라이언트에 JWT 쿠키로 전달
        ResponseCookie cookie = ResponseCookie.from("token", jwt)
            .httpOnly(true)
            .path("/")
            .maxAge(60 * 60)
            .build();*/
        Cookie cookie = new Cookie("token", jwt);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60);
        httpResponse.addCookie(cookie); // ✅ 쿠키 설정 완료
        
        return ResponseEntity.ok("네이버 로그인 성공");
	}
	
	@PostMapping("/kakao-login")
    public ResponseEntity<String> kakaoLogin(@RequestBody Map<String, String> request, HttpServletResponse httpResponse) {
        String accessToken = request.get("accessToken");

        /* ✅ 카카오 사용자 정보 요청
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.set("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.GET,
                entity,
                Map.class
        );

        Map<String, Object> kakaoAccount = (Map<String, Object>) response.getBody().get("kakao_account");
        String nickname = (String) kakaoAccount.get("nickname");  // 닉네임 정보
        
        System.out.println("nickname:"+nickname);
        */

        // ✅ JWT 토큰 발급
        String jwt = jwtUtil.generateToken(accessToken);

        // ✅ 클라이언트에 JWT 쿠키로 전달
        Cookie cookie = new Cookie("token", jwt);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60);
        httpResponse.addCookie(cookie); // ✅ 쿠키 설정 완료
        
        return ResponseEntity.ok("카카오 로그인 성공");
    }
}
