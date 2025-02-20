package com.playhere.couple;


import java.util.Date;

import lombok.Data;

@Data
public class CoupleCodeDTO {
	
	private String userId;
	private String code;
	private Date updatedAt;

}
