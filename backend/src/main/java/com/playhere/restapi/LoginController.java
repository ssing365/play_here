package com.playhere.restapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.playhere.member.IMemberService;
import com.playhere.member.MemberDTO;

@RestController
@RequestMapping("/api")
public class LoginController {
	
	@Autowired
	IMemberService dao;
	
	@PostMapping("/login")
	public String login(@RequestBody MemberDTO member) {
		MemberDTO user = dao.login(member.getUserId(), member.getPassword());
		
		if(user!=null) {
			return "success";
		} else {
			return "fail";
		}	
	}
}
