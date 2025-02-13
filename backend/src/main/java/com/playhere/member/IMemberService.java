package com.playhere.member;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface IMemberService {
	
	//회원가입 전 id 중복 확인
	public int idcheck(String userId);
	
	//회원가입
	
	
	/*****************/
	// 로그인
	public MemberDTO login(@Param("userId") String userId, @Param("password") String password);

}
