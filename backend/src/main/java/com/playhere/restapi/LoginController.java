package com.playhere.restapi;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
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
	
	@PostMapping("/login")
	public ResponseEntity<String> login(@RequestBody MemberDTO member, HttpServletResponse response) {
	    System.out.println("요청 받은 userId: " + member.getUserId());
	    System.out.println("요청 받은 password: " + member.getPassword());

	    MemberDTO user = dao.login(member.getUserId(), member.getPassword());
		
		if(user!=null) {
			// ✅ JWT 토큰 생성
            String jwt = jwtUtil.generateToken(user.getUserId());

            // ✅ HttpOnly 쿠키에 저장
            Cookie cookie = new Cookie("token", jwt);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60); // 1시간
            cookie.setSecure(false); // 🚨 로컬 개발 환경에서는 false
            cookie.setDomain("localhost"); // 필요 시 추가
            response.addCookie(cookie);

            return ResponseEntity.ok("success");
		} else {
			return ResponseEntity.status(401).body("fail");
		}	
	}
	
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
	
	@GetMapping("/check-auth")
	public ResponseEntity<?> checkAuth(@CookieValue(name = "token", required = false) String token) {
		System.out.println("받은 토큰: " + token);  // ✅ 쿠키 확인용 로그
		if (token != null) {
	        try {
	            Claims claims = jwtUtil.validateToken(token);
	            return ResponseEntity.ok(claims.getSubject()); // userId 반환
	        } catch (Exception e) {
	        	e.printStackTrace();
	            return ResponseEntity.status(401).body("unauthorized");
	        }
	    }
		
	    return ResponseEntity.status(401).body("unauthorized");
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
