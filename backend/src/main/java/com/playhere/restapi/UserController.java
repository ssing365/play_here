package com.playhere.restapi;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.playhere.member.IMemberService;
import com.playhere.member.MemberDTO;
import com.playhere.member.UserPreferenceDTO;
import com.playhere.util.JwtUtil;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import utils.MyFunctions;

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
                	if (member.getProfilePicture() != null && !member.getProfilePicture().startsWith("http")) {
                        member.setProfilePicture(member.getProfilePicture());
                    }
                    // 필요한 정보만 Map에 담아서 반환 (보안에 주의)
                	System.out.println(member);
                    Map<String, Object> result = new HashMap<>();
                    result.put("userId", member.getUserId());
                    result.put("nickname", member.getNickname());
                    result.put("profilePicture", member.getProfilePicture());
                    result.put("email", member.getEmail());
                    result.put("birthDate", member.getBirthDate());
                    result.put("zipcode", member.getZipcode());
                    result.put("address", member.getAddress());
                    result.put("detailAddress", member.getDetailAddress());
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
    
 // 사용자 정보 업데이트 API (PUT 사용)
    @PutMapping("/user-update")
    public ResponseEntity<?> updateUser(
    		@RequestPart("formData") String formDataJson,
            @RequestPart(value = "profile_picture", required = false) MultipartFile profilePicture,
            @CookieValue(name = "token", required = false) String token,
            HttpServletResponse response) {
    	
    	// JSON 문자열을 Map으로 변환
	    ObjectMapper objectMapper = new ObjectMapper();
	    Map<String, String> formData;
	    try {
	        formData = objectMapper.readValue(formDataJson, new TypeReference<Map<String, String>>() {});
	    } catch (Exception e) {
	        e.printStackTrace();
	        // JSON 변환 실패 시 회원가입 실패 응답
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("업데이트 실패");
	    }

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        try {
            // JWT 검증 및 userId 추출
            Claims claims = jwtUtil.validateToken(token);
            String userId = claims.getSubject();
            System.out.println("토큰에서 추출한 userId: " + userId);

            // DB 업데이트를 위해 MemberDTO 객체 생성
            MemberDTO updatedUser = new MemberDTO();
            updatedUser.setUserId(userId); // 반드시 토큰에서 추출한 값 사용
            updatedUser.setNickname((String) formData.get("nickname"));
            updatedUser.setEmail((String) formData.get("email"));
            updatedUser.setBirthDate(java.sql.Date.valueOf((String) formData.get("birthDate")));
            updatedUser.setAddress((String) formData.get("address"));
            updatedUser.setDetailAddress((String) formData.get("detailAddress"));
            updatedUser.setZipcode((String) formData.get("postcode"));
            
          //2. 이미지 파일 업로드 처리 
    		if (profilePicture != null && !profilePicture.isEmpty()) {
    			
    			try {
    				//저장할 디렉토리 경로 설정 
    				String uploadDir = "C:/Image/Member";
    				Files.createDirectories(Paths.get(uploadDir)); //디렉토리 생성
    				
    				//원본 파일 명 가져오기
    				String originalFileName = profilePicture.getOriginalFilename();

    	            System.out.println("원본 파일 명 가져오기 : " + originalFileName);
    				if (originalFileName != null && !originalFileName.isEmpty()) {
    					//UUID 이용한 새 파일명 생성
    					String savedFileName = MyFunctions.renameFile(uploadDir, originalFileName);
    					
    					//파일 저장
    					Path filePath = Paths.get(uploadDir, savedFileName);
    					profilePicture.transferTo(filePath.toFile());
    					
    					//DTO에 파일명 저장
    					updatedUser.setProfilePicture(savedFileName);
    					
    				}
    				
    			} catch (Exception e) {
    				 System.out.println("업로드 실패: " + e.getMessage());
    		            e.printStackTrace();
    			}
    		}
            
            // 서비스에서 DB 업데이트 수행
            memberService.updateUser(updatedUser);

            return ResponseEntity.ok("업데이트 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("업데이트 실패");
        }
    }
    
 // 회원 탈퇴 API: 토큰을 검증하여 해당 사용자의 account_status를 0으로 변경
    @PutMapping("/user/withdraw")
    public ResponseEntity<?> withdrawUser(
            @CookieValue(name = "token", required = false) String token,
            HttpServletResponse response) {
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        try {
            Claims claims = jwtUtil.validateToken(token);
            String userId = claims.getSubject();
            // 서비스 호출: 계정 상태를 0으로 업데이트
            memberService.withdrawUser(userId);
            
            /* 로그아웃 */
            Cookie cookie = new Cookie("token", null);
    	    System.out.println(cookie);
    	    cookie.setHttpOnly(true);
    	    cookie.setPath("/");
    	    cookie.setMaxAge(0); // 쿠키 즉시 만료
    	    cookie.setDomain("localhost");
    	    response.addCookie(cookie);
    	    
            return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 탈퇴 실패");
        }
    }
    
    // 선호도 수정
    @Transactional
    @PutMapping("/user/{userId}/preferences")
    public ResponseEntity<Map<String, Integer>> updatePreferences(
    		 @PathVariable("userId") String userId,
    	     @RequestBody List<UserPreferenceDTO> preferences) {
    	System.out.println("prefer"+preferences);
    	Map<String, Integer> response = new HashMap<>();
        try {
        	// 기존 선호도 삭제
            memberService.deleteUserPreferences(userId);
            // 새 선호도 입력 (회원가입 시 사용한 방식과 동일)
            memberService.insertUserPreferences(preferences);
            response.put("result", 1);
            return ResponseEntity.ok(response);
        } catch(Exception e) {
        	e.printStackTrace();
            response.put("result", 0);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 현재 선호도 조회 API
    @GetMapping("/user/{userId}/preferences")
    public ResponseEntity<List<Integer>> getUserPreferences(@PathVariable("userId") String userId) {
        List<Integer> prefList = memberService.getUserPreferences(userId);
        return ResponseEntity.ok(prefList);
    }
    
    
    @PostMapping("/find-id")
    public ResponseEntity<?> findUserId(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");

        // ✅ 입력값 검증 추가
        if (name == null || name.trim().isEmpty() || email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "이름과 이메일을 모두 입력해주세요."));
        }

        String userId = memberService.findUserId(name, email);
        if (userId != null) {
            return ResponseEntity.ok(Map.of("success", true, "userId", userId));
        } else {
            return ResponseEntity.ok(Map.of("success", false, "message", "일치하는 아이디가 없습니다."));
        }
    }

}
