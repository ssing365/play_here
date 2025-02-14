package com.playhere.restapi;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.playhere.visit.VisitService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/visits")
public class VisitControl {
	
	@Autowired
	private VisitService visitService;
	
	
//	@GetMapping("/visits")
//	public List<String> getVisits(@RequestParam String date) {
//        return visitService.getVisitsByDate(date);
//    }

    // 선택한 날짜의 일기 조회
//    @GetMapping("/date")
//    public String getDiary(@RequestParam String date) {
//        return visitService.getDiaryByDate(date);
//    }
//
//    // 일기 저장
//    @PostMapping("/diary")
//    public ResponseEntity<String> saveDiary(@RequestBody Content content) {
//        visitService.saveDiary(content);
//        return ResponseEntity.ok("일기 저장 완료");
//    }
//	
//	@GetMapping("/search")
//	public List<String> searchOnMap(@RequestParam String search) {
//		return visitService.searchWord(search);
//	}
	

	
}
