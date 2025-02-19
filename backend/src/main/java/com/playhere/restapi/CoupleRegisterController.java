package com.playhere.restapi;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.playhere.couple.CoupleRegisterRequestDTO;
import com.playhere.couple.CoupleRegistrationException;
import com.playhere.couple.ICoupleRegisterBusinessService;

@RestController
@RequestMapping("/api/couple")
public class CoupleRegisterController {

    private final ICoupleRegisterBusinessService coupleRegisterService;

    public CoupleRegisterController(ICoupleRegisterBusinessService coupleRegisterService) {
        this.coupleRegisterService = coupleRegisterService;
    }

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