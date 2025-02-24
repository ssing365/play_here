package com.playhere.restapi;


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
	        // placeIds 순서대로 couple_visit 테이블의 index를 업데이트
	        for (int index = 0; index < placeIds.size(); index++) {
	            String placeId = placeIds.get(index);
	            System.out.println("Received placeId: " + placeId);
	            System.out.println(index);
	            // index 업데이트 (예: place_id에 맞는 행을 찾아 index를 설정)
	            dao.updateVisitOrder(coupleId, placeId, index+1, visitDate);
	        }
	    } catch (Exception e) {
	        // 예외 발생 시 로깅 및 처리
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
		System.out.println(date);
		return dao.Schedule(date,coupleId);
	}
	
	@PostMapping("/LastVisit.do")
	public List<CoupleDTO> LastVisit(@RequestBody Map<String, String> requestBody) {
		String coupleId = requestBody.get("coupleId");
		String today = requestBody.get("today");
		return dao.LastVisit(coupleId,today);
	}
	
	@PostMapping("/searchSchedule.do")
	public List<CoupleDTO> searchSchedule(@RequestBody Map<String, String> requestBody) {
		String coupleId = requestBody.get("coupleId");
		String searchWord = requestBody.get("searchWord");
		return dao.searchSchedule(coupleId,searchWord);
	}
	
}
