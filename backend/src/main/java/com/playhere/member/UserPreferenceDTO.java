package com.playhere.member;

import lombok.Data;

@Data
public class UserPreferenceDTO {
	private String userId; // user_id 컬럼
	private int preferenceId; // preference_id 컬럼
}
