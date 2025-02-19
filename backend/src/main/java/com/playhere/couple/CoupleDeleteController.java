package com.playhere.couple;
import com.playhere.member.IMemberService;
import com.playhere.util.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
public class CoupleDeleteController {
	
	@Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private IMemberService memberService;

    // 커플 끊기 API: 토큰을 검증하여 해당 사용자의 couple_status를 0으로 변경
    @PutMapping("/couple/disconnect")
    public ResponseEntity<?> disconnectCouple(
            @CookieValue(name = "token", required = false) String token,
            HttpServletResponse response) {
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        try {
            Claims claims = jwtUtil.validateToken(token);
            String userId = claims.getSubject();
            // 서비스 호출: 커플 상태를 0으로 업데이트
            memberService.disconnectCouple(userId);
            return ResponseEntity.ok("커플 연결이 해제되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("커플 끊기 실패");
        }
    }

}
