package com.playhere.couple;

import com.playhere.member.MemberDTO;

public interface ICoupleRegisterBusinessService {
	void registerCouple(String userId, String coupleCode);
	
	//초대자 정보 조회
	MemberDTO getInviterInfo(String coupleCode);
	
	//초대 코드 정보 조회 메서드 추가
	CoupleCodeDTO getCoupleCodeByCode(String code);
}
