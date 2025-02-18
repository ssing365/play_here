package com.playhere.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.playhere.couple.CoupleCodeDTO;
import com.playhere.couple.ICoupleCodeBusinessService;
import com.playhere.couple.ICoupleCodeService;
import com.playhere.util.CoupleCodeGenerator;

@Service
public class CoupleCodeService implements ICoupleCodeBusinessService {
	
	private final ICoupleCodeService coupleCodeMapper;
	
	//생성자 주입
	public CoupleCodeService(ICoupleCodeService coupleCodeMapper) {
		this.coupleCodeMapper = coupleCodeMapper;
	}
	
	@Override
	public CoupleCodeDTO getCoupleCode(String userId) {
		CoupleCodeDTO coupleCodeDTO = coupleCodeMapper.findByUserId(userId);
		
		//이미 커플이면 "COUPLE" 코드 반환 (갱신x)
		if (coupleCodeDTO != null && "COUPLE".equals(coupleCodeDTO.getCode())) {
			return coupleCodeDTO;
		}
		
		//커플 코드가 없거나, 만료된 경우 새 코드 생성
		 if (coupleCodeDTO == null || coupleCodeDTO.getUpdatedAt() == null || isExpired(coupleCodeDTO.getUpdatedAt())) {
	            System.out.println("새 커플 코드 생성 또는 기존 코드 갱신 필요");
	            String newCode = CoupleCodeGenerator.generateCode();
	            Date now = new Date();

	            if (coupleCodeDTO == null) {
	                // userId가 없으면 새 코드 생성
	                coupleCodeDTO = new CoupleCodeDTO();
	                coupleCodeDTO.setUserId(userId);
	                coupleCodeDTO.setCode(newCode);
	                coupleCodeDTO.setUpdatedAt(now);
	                
	                System.out.println("디버깅: userId=" + coupleCodeDTO.getUserId());
	                
	                coupleCodeMapper.insertCoupleCode(coupleCodeDTO);
	                System.out.println("새 커플 코드 생성 완료: " + newCode);
	            } else {
	                // 기존 코드가 있고, `updatedAt`이 `null`이면 기본값 설정 후 업데이트
	            	if (coupleCodeDTO.getUpdatedAt() == null) {
	                    System.out.println("기존 updatedAt이 null이므로 기본값 설정");
	                    coupleCodeDTO.setUpdatedAt(now);
	                }
	            	
	            	System.out.println("디버깅: userId=" + coupleCodeDTO.getUserId());

	            	coupleCodeDTO.setUserId(userId);
	                coupleCodeDTO.setCode(newCode);
	                coupleCodeDTO.setUpdatedAt(now);
	                coupleCodeMapper.updateCoupleCode(coupleCodeDTO);
	                System.out.println("커플 코드 갱신 완료: " + newCode);
	                
	                coupleCodeDTO = coupleCodeMapper.findByUserId(userId);
	            }
	        }

	        return coupleCodeDTO;
	    }
	
	//오늘 자정 이전인지 확인하는 메서드
	private boolean isExpired(Date updateAt) {
		if (updateAt == null) {
            return true; // ✅ updatedAt이 `null`이면 만료된 것으로 간주
        }
		LocalDate today = LocalDate.now();
		Date todayMidnight = Date.from(today.atStartOfDay(ZoneId.systemDefault()).toInstant());
	    System.out.println("DB updatedAt: " + updateAt);
	    System.out.println("Today's Midnight: " + todayMidnight);
	    return updateAt.before(todayMidnight);
	}
	
	@Override
	@Transactional
	public void updateDailyCoupleCodes() {
		List<String> userIds = coupleCodeMapper.findAllUserIds();
		for (String userId : userIds) {
			CoupleCodeDTO codeDTO = coupleCodeMapper.findByUserId(userId);
			// 이미 커플인 회원은 "COUPLE" 상태이므로 갱신 대상에서 제외
			if (codeDTO != null && "COUPLE".equals(codeDTO.getCode())) {
				continue;
			}
			// 만료된 경우만 새 코드 생성
			String newCode = CoupleCodeGenerator.generateCode();
			if (codeDTO == null) {
				codeDTO = new CoupleCodeDTO();
				codeDTO.setUserId(userId);
				codeDTO.setCode(newCode);
				codeDTO.setUpdatedAt(new Date());
				coupleCodeMapper.insertCoupleCode(codeDTO);
			} else {
				codeDTO.setCode(newCode);
				codeDTO.setUpdatedAt(new Date());
				coupleCodeMapper.updateCoupleCode(codeDTO);
			}
		}
	}
	
}
