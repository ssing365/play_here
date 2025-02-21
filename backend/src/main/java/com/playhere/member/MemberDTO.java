package com.playhere.member;

import java.sql.Date;

import lombok.Data;

@Data
public class MemberDTO {
	private String userId; //user_id 컬럼
	private String password; //password 컬럼
	private String name; //name 컬럼
	private String nickname; //nickname 컬럼
	private String email; //email 컬럼
	private Date birthDate; //birth_date 컬럼
	private String zipcode; //zipcode 컬럼 (우편번호)
	private String address; //address 컬럼 (기본주소)
	private String detailAddress; //detail_addresss 컬럼(상세주소)
	private String profilePicture;  // profile_picture 컬럼
    private int coupleId;          // couple_id 컬럼
    private int coupleStatus;   // couple_status 컬럼
    private int accountStatus;  // account_status 컬럼
    private Date createdAt;         // created_at 컬럼
    private Date updatedAt;         // updated_at 컬럼
}
