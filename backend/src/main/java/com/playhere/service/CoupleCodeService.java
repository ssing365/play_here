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
		
		if (coupleCodeDTO != null && "COUPLE".equals(coupleCodeDTO.getCode())) {
			//이미 커플 등록된 상태이면 그대로 반환
			return coupleCodeDTO;
		}
		
		if (coupleCodeDTO == null || isExpired(coupleCodeDTO.getUpdatedAt())) {
			//신규 생성 혹은 갱신 필요
			String newCode = CoupleCodeGenerator.generateCode();
			Date now = new Date();
			if (coupleCodeDTO == null) {
				coupleCodeDTO = new CoupleCodeDTO();
				coupleCodeDTO.setUserId(userId);
				coupleCodeDTO.setCode(newCode);
				coupleCodeDTO.setUpdatedAt(now);
				coupleCodeMapper.insertCoupleCode(coupleCodeDTO);
				
				
			} 
			else {
				coupleCodeDTO.setCode(newCode);
				coupleCodeDTO.setUpdatedAt(now);
				coupleCodeMapper.updateCoupleCode(coupleCodeDTO);
			}
			
		}
		return coupleCodeDTO;
	}
	
	//오늘 자정 이전인지 확인하는 메서드
	private boolean isExpired(Date updateAt) {
		if (updateAt == null) {
		    return true;  // null인 경우 만료된 것으로 처리
		}
		LocalDate today = LocalDate.now();
		Date todayMidnight = Date.from(today.atStartOfDay(ZoneId.systemDefault()).toInstant());
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
