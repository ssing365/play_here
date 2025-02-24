package com.playhere.couple;
import com.playhere.member.IMemberService;
import com.playhere.member.MemberDTO;
import com.playhere.util.JwtUtil;
import io.jsonwebtoken.Claims;

import java.util.HashMap;
import java.util.Map;

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

    // ✅ 생성자 추가 → `final` 필드 초기화
    @Autowired
    private IMemberService memberService;  // ✅ `@Autowired`로 변경!
    
    @Autowired
    private ICoupleRegisterService coupleRegisterService;
    
    // 커플 끊기 API: 토큰을 검증하여 해당 사용자의 couple_status를 0으로 변경
    @PutMapping("/couple/disconnect")
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public ResponseEntity<?> disconnectCouple(HttpServletRequest request) {

    	Map<String, Object> response = new HashMap<>();
        
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
            // 🔹 **현재 사용자 조회 (본인 정보)**
            MemberDTO user = memberService.findByUserId(userId);
            if (user == null) {
            	System.out.println("❌ [백엔드] 사용자를 찾을 수 없음.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유효하지 않은 요청입니다. 커플 ID가 없습니다.");
            }

            // 🔹 **파트너 정보 조회**
            Integer coupleId = memberService.getCoupleId(userId);
            if (coupleId == null || coupleId == 0) {
                System.out.println("❌ [백엔드] 커플 ID가 없거나 0입니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유효하지 않은 요청입니다. 커플 ID가 없습니다.");
            }
            
            System.out.println("🔍 [백엔드] coupleId 확인: " + coupleId);
            
            //파트너 정보 조회
            MemberDTO partner = memberService.findPartnerByCoupleId(coupleId, userId);
            if (partner == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("파트너 정보를 찾을 수 없습니다.");
            }

            String partnerId = partner.getUserId();
            System.out.println("🔍 [백엔드] 파트너 userId 확인: " + partnerId);

         // 5️⃣ 트랜잭션 내에서 모든 작업 수행
            try {
                System.out.println("🔄 [백엔드] 1. 커플 끊는 사용자 상태 업데이트 시작...");
                coupleRegisterService.updateMemberAfterDisconnect(userId);
                System.out.println("✅ [백엔드] 1. 커플 끊는 사용자 상태 업데이트 완료.");
                
                System.out.println("🔄 [백엔드] 2. 파트너 상태 업데이트 시작...");
                coupleRegisterService.updatePartnerAfterDisconnect(partnerId);
                System.out.println("✅ [백엔드] 2. 파트너 상태 업데이트 완료.");
                
                System.out.println("🔄 [백엔드] 3. 커플 테이블에서 관계 삭제 시작...");
                coupleRegisterService.deleteCoupleByUser(userId);
                System.out.println("✅ [백엔드] 3. 커플 테이블에서 관계 삭제 완료.");
                
                System.out.println("🔄 [백엔드] 4. 사용자의 커플 코드 삭제 시작...");
                coupleRegisterService.deleteCoupleCodeByUser(userId);  // 수정된 부분
                System.out.println("✅ [백엔드] 4. 사용자의 커플 코드 삭제 완료.");
                
                System.out.println("🔄 [백엔드] 5. 파트너의 커플 코드 삭제 시작...");
                coupleRegisterService.deleteCoupleCodeByUser(partnerId);
                System.out.println("✅ [백엔드] 5. 파트너의 커플 코드 삭제 완료.");
                
                response.put("status", "success");
                response.put("message", "커플 연결이 성공적으로 해제되었습니다.");
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                System.err.println("❌❌❌ [백엔드] SQL 실행 중 오류 발생: " + e.getMessage());
                e.printStackTrace();
                throw e; // 트랜잭션 롤백을 위해 예외 다시 던지기
            }
        } catch (Exception e) {
            System.err.println("❌❌❌ [백엔드] 커플 끊기 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "커플 끊기 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}