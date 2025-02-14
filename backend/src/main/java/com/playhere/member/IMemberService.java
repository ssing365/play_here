package com.playhere.member;



import java.util.List;
import java.util.Map;

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
}
