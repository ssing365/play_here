package com.playhere.restapi;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.playhere.place.IPlaceService;
import com.playhere.place.PlaceDTO;

import org.springframework.web.bind.annotation.GetMapping;
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
	

}
