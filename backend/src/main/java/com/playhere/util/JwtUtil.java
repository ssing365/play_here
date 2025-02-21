package com.playhere.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.security.Keys;
import java.security.Key;

import java.util.Date;

@Component
public class JwtUtil {
    private final long EXPIRATION_TIME = 1000 * 60 * 60; // 1시간

    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    
    
    // ✅ 토큰 생성
	public String generateToken(String userId) {
        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }

    // ✅ 토큰 검증
	public Claims validateToken(String token) {
        return Jwts.parserBuilder()
        		.setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
	
}