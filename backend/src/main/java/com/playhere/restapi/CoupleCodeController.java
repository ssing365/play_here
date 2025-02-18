package com.playhere.restapi;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.playhere.couple.CoupleCodeDTO;
import com.playhere.couple.ICoupleCodeBusinessService;
import io.jsonwebtoken.Claims;

@RestController
@RequestMapping("/api/couple-code")
public class CoupleCodeController {
	
	private final ICoupleCodeBusinessService coupleCodeService;
	
	public CoupleCodeController(ICoupleCodeBusinessService coupleCodeService) {
		this.coupleCodeService = coupleCodeService;

	}
	
	//userId를 요청 파라미터로 받아 커플 코드 조회
	@GetMapping
	public ResponseEntity<CoupleCodeDTO> getMyCoupleCode(@RequestParam(name = "userId") String userId) {
		if (userId == null || userId.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
		
		try {
            System.out.println("요청받은 userId: " + userId);
            
            CoupleCodeDTO coupleCodeDTO = coupleCodeService.getCoupleCode(userId);
            if (coupleCodeDTO == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 커플 코드 없음
            }

            return ResponseEntity.ok(coupleCodeDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
	    }
	}