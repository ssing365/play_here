package com.playhere.restapi;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.playhere.member.IMemberService;
import com.playhere.member.MemberDTO;
import com.playhere.util.JwtUtil;

import io.jsonwebtoken.Claims;

@RestController
@RequestMapping("/api")
public class UserController {
	
	@Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private IMemberService memberService;
    
 // 로그인 상태 확인 및 사용자 정보 반환 API
    @GetMapping("/user-info")
    public ResponseEntity<?> getUserInfo(@CookieValue(name = "token", required = false) String token) {
        System.out.println("받은 토큰: " + token);
        if (token != null) {
            try {
                Claims claims = jwtUtil.validateToken(token);
                String userId = claims.getSubject(); 
                System.out.println("Subject: " + userId);
                // DB에서 사용자 정보 조회
                MemberDTO member = memberService.findByUserId(userId);
                if (member != null) {
                	/* 이미지 불러오기 시도 실패
                	 * if (member.getProfilePicture() != null && !member.getProfilePicture().startsWith("http")) {
                        member.setProfilePicture("http://localhost:8586/images/" + member.getProfilePicture());
                    }*/
                	
                    // 필요한 정보만 Map에 담아서 반환 (보안에 주의)
                    Map<String, Object> result = new HashMap<>();
                    result.put("userId", member.getUserId());
                    result.put("nickname", member.getNickname());
                    result.put("profilePicture", member.getProfilePicture());
                    result.put("email", member.getEmail());
                    result.put("birthDate", member.getBirthDate());
                    result.put("address", member.getAddress());
                    result.put("coupleStatus", member.getCoupleStatus());
                    result.put("coupleId", member.getCoupleId());
                    System.out.println("user-info 반환 확인 : " + result);
                    return ResponseEntity.ok(result);
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
                }
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("unauthorized");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("unauthorized");
    }

}
