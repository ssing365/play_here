package com.playhere.restapi;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.playhere.place.IPlaceService;
import com.playhere.place.PlaceDTO;
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
	
	@GetMapping("/top5.do")
	public List<PlaceDTO> placeTop5() {
		return dao.top5();
	}
	
	@PostMapping("/interests.do")
	public List<PlaceDTO> interests(@RequestBody Map<String, String> requestBody) {
		String userId = requestBody.get("userId"); // body에서 userId 추출
		return dao.interests(userId);
	}
	
	
}
