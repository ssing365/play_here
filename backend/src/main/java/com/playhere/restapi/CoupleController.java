package com.playhere.restapi;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.playhere.couple.CoupleDTO;
import com.playhere.couple.ICoupleService;
import com.playhere.place.PlaceDTO;


@RestController
public class CoupleController {

	@Autowired
	ICoupleService dao;
	
	@PostMapping("/coupleInfo.do")
	public List<CoupleDTO> coupleInfo(@RequestBody Map<String, String> requestBody) {
		String coupleId = requestBody.get("coupleId");
		String userId = requestBody.get("userId");
		return dao.coupleInfo(coupleId,userId);
	}
	
	@PostMapping("/visitList.do")
	public List<CoupleDTO> visitList(@RequestBody Map<String, String> requestBody){
		String coupleId = requestBody.get("coupleId");
		String visitDate = requestBody.get("visitDate");
		return dao.visit(coupleId, visitDate);
	}
	
	@PostMapping("/visitDelete.do")
	public void visitDelete(@RequestBody Map<String, String> requestBody) {
		String coupleId = requestBody.get("coupleId");
		String visitDate = requestBody.get("visitDate");
		String placeId = requestBody.get("placeId");
		dao.visitDelete(coupleId,placeId, visitDate);
	}
	
	@PostMapping("/updateVisitOrder.do")
	public void updateVisitOrder(@RequestBody Map<String, Object> requestBody) {
	    List<String> placeIds = (List<String>) requestBody.get("placeIds");
	    String coupleId = String.valueOf(requestBody.get("coupleId"));
	    String visitDate = (String) requestBody.get("visitDate");

	    try {
	        // placeIds �닚�꽌��濡� couple_visit �뀒�씠釉붿쓽 index瑜� �뾽�뜲�씠�듃
	        for (int index = 0; index < placeIds.size(); index++) {
	            String placeId = placeIds.get(index);
	            System.out.println("Received placeId: " + placeId);
	            System.out.println(index);
	            // index �뾽�뜲�씠�듃 (�삁: place_id�뿉 留욌뒗 �뻾�쓣 李얠븘 index瑜� �꽕�젙)
	            dao.updateVisitOrder(coupleId, placeId, index+1, visitDate);
	        }
	    } catch (Exception e) {
	        // �삁�쇅 諛쒖깮 �떆 濡쒓퉭 諛� 泥섎━
	        System.err.println("Error during updateVisitOrder: " + e.getMessage());
	        e.printStackTrace();
	    }
	}
	
	@PostMapping("/Diary.do")
	public List<CoupleDTO> Diary(@RequestBody CoupleDTO request) {
		String diary_date = request.getDiaryDate();
	    String couple_id = request.getCoupleId();
	    String diary_writer = request.getDiaryWriter();
	    
		return dao.Diary(couple_id, diary_writer, diary_date);
	}
	
	@PostMapping("/DiaryEdit.do")
	public void DiaryEdit(@RequestBody CoupleDTO request) {
		String diary_date = request.getDiaryDate();
		String couple_id = request.getCoupleId();
		String diary_writer = request.getDiaryWriter();
		String content = request.getContent();
		
		dao.DiaryEdit(couple_id, diary_writer, diary_date,content);
	}
	@PostMapping("/DiaryDelete.do")
	public void DiaryDelete(@RequestBody CoupleDTO request) {
		String diary_date = request.getDiaryDate();
		String couple_id = request.getCoupleId();
		String diary_writer = request.getDiaryWriter();
		
		dao.DiaryDelete(couple_id, diary_writer, diary_date);
	}
	
	
	@PostMapping("/NewDiary.do")
	public void NewDiary(@RequestBody Map<String, String> requestBody) {
		String couple_id = requestBody.get("coupleId");
		String diary_date = requestBody.get("diaryDate");
		String diary_writer = requestBody.get("diaryWriter");
		String content = requestBody.get("content");
		
		dao.NewDiary(couple_id, diary_writer, diary_date,content);
	}
	
	@GetMapping("/SearchPlace.do")
	public List<PlaceDTO> SearchPlace() {
		return dao.SearchPlace();
	}
	
	@PostMapping("/Schedule.do")
	public List<CoupleDTO> Schedule(@RequestBody Map<String, String> requestBody) {
		String date = requestBody.get("date");
		String coupleId = requestBody.get("coupleId");
		System.out.println("date:"+date);
		return dao.Schedule(date,coupleId);
	}
	
	@PostMapping("/DiaryWrited.do")
	public List<CoupleDTO> DiaryWrited(@RequestBody Map<String, String> requestBody) {
		String date = requestBody.get("date");
		String coupleId = requestBody.get("coupleId");
		System.out.println(date);
		return dao.DiaryWrited(date,coupleId);
	}
	
	@PostMapping("/LastVisit.do")
	public List<CoupleDTO> LastVisit(@RequestBody Map<String, String> requestBody) {
		String coupleId = requestBody.get("coupleId");
		String today = requestBody.get("today");
		return dao.LastVisit(coupleId,today);
	}
	
	@PostMapping("/searchSchedule.do")
	public List<CoupleDTO> searchSchedule(@RequestBody Map<String, Object> requestBody) {
	    String coupleId = String.valueOf(requestBody.get("coupleId"));
	    List<String> searchWord = (List<String>) requestBody.get("searchWord");
	    return dao.searchSchedule(coupleId, searchWord);
	}



	
}
