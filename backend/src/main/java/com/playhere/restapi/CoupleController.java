package com.playhere.restapi;


import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.playhere.couple.CoupleDTO;
import com.playhere.couple.ICoupleService;


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
	        System.out.println("Received placeIds: " + placeIds);
	        System.out.println("Received coupleId: " + coupleId);
	        System.out.println("Received visitDate: " + visitDate);

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
		String diary_date = request.getDiary_date();
	    String couple_id = request.getCouple_id();
	    String diary_writer = request.getDiary_writer();

	    
		return dao.Diary(couple_id, diary_writer, diary_date);
	}
	
	@PostMapping("/DiaryEdit.do")
	public void DiaryEdit(@RequestBody CoupleDTO request) {
		String diary_date = request.getDiary_date();
		String couple_id = request.getCouple_id();
		String diary_writer = request.getDiary_writer();
		String content = request.getContent();
		
		dao.DiaryEdit(couple_id, diary_writer, diary_date,content);
	}
	
	@PostMapping("/NewDiary.do")
	public void NewDiary(@RequestBody Map<String, String> requestBody) {
		String couple_id = requestBody.get("couple_id");
		String diary_date = requestBody.get("diary_date");
		String diary_writer = requestBody.get("diary_writer");
		String content = requestBody.get("content");
		
		dao.NewDiary(couple_id, diary_writer, diary_date,content);
	}
	

	

}
