package com.playhere.couple;
import com.playhere.member.IMemberService;
import com.playhere.util.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
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
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public ResponseEntity<?> disconnectCouple(HttpServletRequest request) {
        
        System.out.println("🚀 [백엔드] 커플 끊기 요청 도착!");

        // 1️⃣ Authorization 헤더에서 토큰 찾기
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        } else {
            // 2️⃣ Authorization 헤더가 없으면 쿠키에서 찾기
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("token".equals(cookie.getName())) {
                        token = cookie.getValue();
                        break;
                    }
                }
            }
        }

        System.out.println("🔍 [백엔드] 받은 토큰: " + token);
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: 토큰이 없습니다.");
        }

        try {
            // 3️⃣ JWT 토큰 검증 후 userId 추출
            Claims claims = jwtUtil.validateToken(token);
            String userId = claims.getSubject();
            System.out.println("✅ [백엔드] 추출된 userId: " + userId);

            // 4️⃣ 커플 끊기 처리
            coupleRegisterService.disconnectCouple(userId);

            return ResponseEntity.ok("커플 연결이 해제되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("커플 끊기 실패: " + e.getMessage());
        }
    }

}