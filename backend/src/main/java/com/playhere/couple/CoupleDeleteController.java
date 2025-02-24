package com.playhere.couple;
import com.playhere.member.IMemberService;
import com.playhere.util.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
public class CoupleDeleteController {
	
	@Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private IMemberService memberService;

    @Autowired
    private ICoupleRegisterService coupleRegisterService; // 우리가 만든 서비스 추가
    
    // 커플 끊기 API: 토큰을 검증하여 해당 사용자의 couple_status를 0으로 변경
    @PutMapping("/couple/disconnect")
    public ResponseEntity<?> disconnectCouple(HttpServletRequest request, HttpServletResponse response) {
        
    	System.out.println("🚀 [백엔드] 커플 끊기 요청 도착!"); // 추가된 디버깅 코드
    	
    	// JWT 토큰을 쿠키에서 직접 읽기
        String token = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
        
    	System.out.println("🔍 [백엔드] 받은 토큰: " + token); // 추가된 디버깅 코드
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        try {
            // JWT 토큰 검증 후 userId 추출
            Claims claims = jwtUtil.validateToken(token);
            String userId = claims.getSubject();
            System.out.println("✅ [백엔드] 추출된 userId: " + userId); // 추가된 디버깅 코드
            // 기존 기능 유지 (커플 상태 0으로 업데이트)
            memberService.disconnectCouple(userId);
            
            // 추가된 기능 (member, couple, couple_code 업데이트)
            coupleRegisterService.disconnectCouple(userId);

            return ResponseEntity.ok("커플 연결이 해제되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("커플 끊기 실패: " + e.getMessage());
        }
    }
}