package com.playhere.restapi;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.playhere.couple.CoupleCodeDTO;
import com.playhere.couple.ICoupleCodeBusinessService;
import com.playhere.util.JwtUtil;

import io.jsonwebtoken.Claims;

@RestController
@RequestMapping("/api/couple-code")
public class CoupleCodeController {
	
	private final ICoupleCodeBusinessService coupleCodeService;
	private final JwtUtil jwtUtil;
	
	public CoupleCodeController(ICoupleCodeBusinessService coupleCodeService, JwtUtil jwtUtil) {
		this.coupleCodeService = coupleCodeService;
		this.jwtUtil = jwtUtil;
	}
	
	//내 커플 코드를 조회하는 API
	@GetMapping
	public ResponseEntity<CoupleCodeDTO> getMyCoupleCode(@CookieValue(name = "token", required = false) String token) {
	    
		 if (token == null) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	     }
		 
		 try {
	            Claims claims = jwtUtil.validateToken(token);
	            String userId = claims.getSubject();
	            CoupleCodeDTO coupleCodeDTO = coupleCodeService.getCoupleCode(userId);
	            return ResponseEntity.ok(coupleCodeDTO);
	        } catch (Exception e) {
	            e.printStackTrace();
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	        }
	    }
	}