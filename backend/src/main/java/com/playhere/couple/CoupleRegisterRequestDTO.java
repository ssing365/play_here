package com.playhere.couple;

import lombok.Data;

@Data
public class CoupleRegisterRequestDTO {

	private String userId; // 수락자의 ID
	private String coupleCode; //초대자의 커플 코드
}
