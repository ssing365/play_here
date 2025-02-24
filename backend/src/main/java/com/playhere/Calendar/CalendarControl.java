package com.playhere.Calendar;

import java.util.Collections;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CalendarControl {
    private static final Logger log = LoggerFactory.getLogger(CalendarControl.class);

    @Autowired
	public VisitMapper visitMapper;
	
	@GetMapping("/Calendar")
	public List<CalendarVisitDTO> getVisitPlace(@RequestParam String coupleId,  @RequestParam String visitDate) {
		
            Long parsedCoupleId = Long.parseLong(coupleId);
            log.info("📌 받은 요청: coupleId = {}, visitDate = {}", parsedCoupleId, visitDate);

            List<CalendarVisitDTO> result = visitMapper.getVisitPlace(parsedCoupleId, visitDate);
            
            log.info("✅ 반환할 데이터: {}", result);
            return result;
        
    }
//		System.out.println("받은 요청: coupleId = " + coupleId + ", visitDate = " + visitDate);
//		
//		List<CalendarVisitDTO> result = visitMapper.getVisitPlace(coupleId, visitDate);
//	    System.out.println("반환할 데이터: " + result);
//	    return result;
//    }
  }

	
	

