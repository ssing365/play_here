package com.playhere.Calendar;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VisitPlaceService {

	
	private final VisitMapper visitMapper;

	
	public List<CalendarVisitDTO> getVisitPlace( Long coupleId, String visitDate){
		return visitMapper.getVisitPlace(coupleId, visitDate);
}
	
	
}
