package com.playhere.restapi;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.playhere.couple.CoupleCodeDTO;
import com.playhere.couple.CoupleRegisterRequestDTO;
import com.playhere.couple.CoupleRegistrationException;
import com.playhere.couple.ICoupleCodeBusinessService;
import com.playhere.couple.ICoupleRegisterBusinessService;
import com.playhere.member.MemberDTO;

@RestController
@RequestMapping("/api/couple")
public class CoupleRegisterController {

    private final ICoupleRegisterBusinessService coupleRegisterService;

    public CoupleRegisterController(ICoupleRegisterBusinessService coupleRegisterService) {
        this.coupleRegisterService = coupleRegisterService;
    }

    //초대자 정보 조회
    @GetMapping("/inviter-info")
    public ResponseEntity<?> getInviterInfo(@RequestParam("code") String code) {
    	try {
            MemberDTO inviterMember = coupleRegisterService.getInviterInfo(code);
            if (inviterMember == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("유효하지 않은 커플 코드입니다.");
            }
            

            // JSON 형태로 응답
            Map<String, String> response = Map.of(
                "name", inviterMember.getName(),
                "nickname", inviterMember.getNickname()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
        }
    }
    
    @GetMapping("/inviter-code-info")
    public ResponseEntity<?> getInviterCodeInfo(@RequestParam("code") String code) {
        try {
            CoupleCodeDTO coupleCode = coupleRegisterService.getCoupleCodeByCode(code);
            if (coupleCode == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("유효하지 않은 커플 코드입니다.");
            }

            //updatedAt을 ISO 8601 형식(UTC)으로 변환
            String updatedAtISO = ZonedDateTime.ofInstant(
                coupleCode.getUpdatedAt().toInstant(), ZoneId.of("UTC")
            ).format(DateTimeFormatter.ISO_INSTANT);
            
            // JSON 형태로 응답
            Map<String, Object> response = Map.of(
                "userId", coupleCode.getUserId(),
                "code", coupleCode.getCode(),
                "updatedAt", updatedAtISO // updatedAt 추가
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
        }
    }

    
    
    //커플 연결
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerCouple(@RequestBody CoupleRegisterRequestDTO request) {
        Map<String, String> response = new HashMap<>();
        try {
            coupleRegisterService.registerCouple(request.getUserId(), request.getCoupleCode());
            response.put("message", "커플 연결 성공!");
            return ResponseEntity.ok(response);
        } catch (CoupleRegistrationException e) {
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("message", "서버 오류 발생");
            return ResponseEntity.internalServerError().body(response);
        }
    }

}