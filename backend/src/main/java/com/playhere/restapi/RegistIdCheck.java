package com.playhere.restapi;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.playhere.member.IMemberService;

@RestController
@RequestMapping("/api")
public class RegistIdCheck {

	@Autowired
	IMemberService dao;
	
	//id 중복확인
	@GetMapping("/idcheck.do")
	public Map<String, Integer> registIdCheck(@RequestParam("user_id") String userId){
		int result = dao.idcheck(userId);
		Map<String, Integer> map = new HashMap<>();
		map.put("result", result);
		return map;
	}
	
}
