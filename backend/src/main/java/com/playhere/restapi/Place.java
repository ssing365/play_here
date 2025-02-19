package com.playhere.restapi;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.playhere.place.IPlaceService;
import com.playhere.place.ParameterDTO;
import com.playhere.place.PlaceDTO;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class Place {
	
	@Autowired
	IPlaceService dao;
	
	
	@GetMapping("/placeList.do")
	public List<PlaceDTO> placeList(ParameterDTO parameterDTO) {
	    // 한 페이지에 출력할 게시물의 수
	    int pageSize = 10;
	    // 페이지 번호
	    System.out.println(parameterDTO);
	    int pageNum = parameterDTO.getPageNum() == null ? 1 : Integer.parseInt(parameterDTO.getPageNum());
	    // 게시물의 구간 계산
	    int start = (pageNum - 1) * pageSize + 1;
	    int end = pageNum * pageSize;

	    parameterDTO.setStart(start);
	    parameterDTO.setEnd(end);

//	    // 검색 위치와 검색어 처리
	    ArrayList<String> searchLocation = parameterDTO.getSearchLocation();
	    ArrayList<String> searchWord = parameterDTO.getSearchWord();
	    ArrayList<String> searchCategory = parameterDTO.getSearchCategory();
	    System.out.println("searchWord:"+searchWord);
	    System.out.println("searchloca:"+searchLocation);
	    System.out.println("searchCate:"+searchCategory);
	    // 예시로 검색 조건을 출력
	    System.out.println("start: " +parameterDTO.getStart());
	    System.out.println("end: " + parameterDTO.getEnd());

	    // DAO 메서드 호출하여 필터링된 장소 리스트 반환
	    return dao.list(parameterDTO);
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
	
	@PostMapping("/addCalendar.do")
	public void addCalendar(@RequestBody Map<String, String> requestBody) {
		String userId = requestBody.get("userId");
		String placeId = requestBody.get("placeId");
		String coupleId = requestBody.get("coupleId");
		System.out.println("placeId : "+placeId);
		
		// String → LocalDate → java.sql.Date 변환
		String visitDateStr = requestBody.get("visitDate");
		LocalDate localDate = LocalDate.parse(visitDateStr.split("T")[0]); // "T" 이후 시간 제거
		Date visitDate = Date.valueOf(localDate); // java.sql.Date 변환
		
		System.out.println("visitDateStr: " + visitDateStr); // 원본 문자열 확인
		System.out.println("localDate: " + localDate); // LocalDate 변환 결과
		System.out.println("visitDate (sql.Date): " + visitDate); // 최종 변환된 값


	    // Service 호출 (MyBatis Mapper 연결)
	    dao.addCalendar(placeId, coupleId, visitDate);
		dao.InterestCancle(userId, placeId);
	}
	
	@PostMapping("interestCancle.do")
	public void InterestCancle(@RequestBody Map<String, String> requestBody) {
		String userId = requestBody.get("userId");
		String placeId = requestBody.get("placeId");
		dao.InterestCancle(userId, placeId);
		
	}
	
	
}
