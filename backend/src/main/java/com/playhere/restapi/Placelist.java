package com.playhere.restapi;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.playhere.member.IMemberService;
import com.playhere.place.IPlaceService;
import com.playhere.place.PlaceDTO;
import com.playhere.util.JwtUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class Placelist {
	
	@Autowired
	IPlaceService dao;

	
	@GetMapping("/placeList.do")
	public List<PlaceDTO> placeList() {
		    return dao.list();
	}
	
	@GetMapping("/placeView.do")
	public List<PlaceDTO> placeView(@RequestParam("id") String PlaceId){
		return dao.view(PlaceId);
	}
	
	@PostMapping("/placeLike.do")
	public void placeLike(@RequestBody Map<String, String> params) {
		
		String userId = params.get("userId");
	    String placeId = params.get("PlaceId");
	    
		try {

			int check = dao.Interestcheck(userId, placeId);
			if (check == 0) {
	            dao.InterestAdd(userId, placeId);
	            dao.placeLikeAdd(placeId);
	        } else {
	            dao.InterestCancle(userId, placeId);
	            dao.placeLikeCancle(placeId);
	        }

	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}
	
}
