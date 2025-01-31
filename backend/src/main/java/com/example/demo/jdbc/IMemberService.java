package com.example.demo.jdbc;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface IMemberService {
	
	public List<MemberDTO> select();

}
