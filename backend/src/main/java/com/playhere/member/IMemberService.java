package com.playhere.member;


import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface IMemberService {
	
	//회원가입 전 id 중복 확인
	public int idcheck(String userId);
	
	//회원가입(DB입력)
	public int insertMemberinfo(MemberDTO memberDTO);
	
	//회원가입 후 회원의 선호도 입력
	public int insertUserPreferences(List<UserPreferenceDTO> preferences);

	// 로그인
	public MemberDTO login(@Param("userId") String userId, @Param("password") String password);
	
	// 로그인한 유저 정보 출력
	public MemberDTO findByUserId(@Param("userId") String userId);

	// 정보 수정
	public void updateUser(MemberDTO updatedUser);


}
