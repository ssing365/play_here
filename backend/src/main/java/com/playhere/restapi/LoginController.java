package com.playhere.restapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
    private JwtUtil jwtUtil;
	
	@PostMapping("/login")
	public ResponseEntity<String> login(@RequestBody MemberDTO member, HttpServletResponse response) {
		MemberDTO user = dao.login(member.getUserId(), member.getPassword());
		
		if(user!=null) {
			// ✅ JWT 토큰 생성
            String jwt = jwtUtil.generateToken(user.getUserId());

            // ✅ HttpOnly 쿠키에 저장
            Cookie cookie = new Cookie("token", jwt);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60); // 1시간
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
	    if (token != null) {
	        try {
	            Claims claims = jwtUtil.validateToken(token);
	            return ResponseEntity.ok(claims.getSubject()); // userId 반환
	        } catch (Exception e) {
	            return ResponseEntity.status(401).body("unauthorized");
	        }
	    }
	    return ResponseEntity.status(401).body("unauthorized");
	}
}
