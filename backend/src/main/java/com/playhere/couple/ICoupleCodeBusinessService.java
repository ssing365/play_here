package com.playhere.couple;

public interface ICoupleCodeBusinessService {

	CoupleCodeDTO getCoupleCode(String userId);
	void updateDailyCoupleCodes();
	
}
