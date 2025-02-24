package com.playhere.restapi;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.playhere.place.IPlaceService;
import com.playhere.place.ParameterDTO;
import com.playhere.place.PlaceDTO;


@RestController
public class Place {
	
	@Autowired
	IPlaceService dao;
	
	@CrossOrigin(origins = "http://localhost:5173")
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

//	    검색 위치와 검색어 처리
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
	    System.out.println(dao.list(parameterDTO));
	    return dao.list(parameterDTO);
	}
	
	@CrossOrigin(origins = "http://localhost:5173")
	 @GetMapping("/placeListAll.do")
	    public List<PlaceDTO> placeListAll(ParameterDTO parameterDTO) {
	        System.out.println("전체 검색 조건: " + parameterDTO);
	        // DAO에 전체 결과를 반환하는 메서드를 호출합니다.
	        // dao.listAll(parameterDTO) 메서드는 내부에서 페이징 계산을 하지 않고 조건에 맞는 모든 결과를 반환해야 합니다.
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
	        
//		    검색 위치와 검색어 처리
		    ArrayList<String> searchLocation = parameterDTO.getSearchLocation();
		    ArrayList<String> searchWord = parameterDTO.getSearchWord();
		    ArrayList<String> searchCategory = parameterDTO.getSearchCategory();
		    System.out.println("searchWord:"+searchWord);
		    System.out.println("searchloca:"+searchLocation);
		    System.out.println("searchCate:"+searchCategory);
		    // 예시로 검색 조건을 출력
		    System.out.println("start: " +parameterDTO.getStart());
		    System.out.println("end: " + parameterDTO.getEnd());
		    
	        return dao.listLikes(parameterDTO);
	    }

	@GetMapping("/placeView.do")
	public List<PlaceDTO> placeView(@RequestParam("id") int PlaceId){
		return dao.view(PlaceId);
	}
	
	@GetMapping("/closePlace.do")
	public List<PlaceDTO> closePlace(@RequestParam("longitude") double longitude, @RequestParam("latitude") double latitude) {
		double longitude1 = longitude - 0.01;
		double longitude2 = longitude + 0.01;
		double latitude1 = latitude - 0.01;
		double latitude2 = latitude + 0.01;
		
		return dao.closePlace(longitude1,longitude2,latitude1,latitude2);
	}
	
	
	// 좋아요 여부 확인
    @GetMapping("/likeStatus.do")
    public boolean likeStatus(@RequestParam("userId") String userId,
            @RequestParam("placeId") String placeId) {
    	int check = dao.Interestcheck(userId, placeId);
        if(check == 1) {
        	return true;
        }else return false;
    }
   
    
	@PostMapping("/placeLike.do")
	public void placeLike(@RequestBody Map<String, String> params) {
		
		String userId = params.get("userId");
	    String placeId = params.get("placeId");
	    
		try {

			int check = dao.Interestcheck(userId, placeId);
			if (check == 0) {
	            dao.InterestAdd(userId, placeId);
	            dao.placeLikeAdd(placeId);
	        } else {
	            dao.InterestCancel(userId, placeId);
	            dao.placeLikeCancel(placeId);
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
	public String addCalendar(@RequestBody Map<String, String> requestBody) {
		String placeId = requestBody.get("placeId");
		String coupleId = requestBody.get("coupleId");
		System.out.println("placeId : "+placeId);
		
		// String → LocalDate → java.sql.Date 변환
		String visitDateStr = requestBody.get("visitDate");
		LocalDate localDate = LocalDate.parse(visitDateStr.split("T")[0]); // "T" 이후 시간 제거
		Date visitDate = Date.valueOf(localDate); // java.sql.Date 변환
		if(dao.CheckCalendar(placeId, coupleId, visitDate)==1) {
			return "0";
		}
		else {
			System.out.println("visitDateStr: " + visitDateStr); // 원본 문자열 확인
			System.out.println("localDate: " + localDate); // LocalDate 변환 결과
			System.out.println("visitDate (sql.Date): " + visitDate); // 최종 변환된 값
			
			dao.addCalendar(placeId, coupleId, visitDate);
			return "1";
			}
	
	}
	
	@PostMapping("interestCancel.do")
	public void InterestCancel(@RequestBody Map<String, String> requestBody) {
		String userId = requestBody.get("userId");
		String placeId = requestBody.get("placeId");
		dao.InterestCancel(userId, placeId);
		
	}
	


	
	
}
