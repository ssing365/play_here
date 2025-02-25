package com.playhere.event;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EventService {

	 @Autowired
	 private EventMapper eventMapper;

	 public List<EventDTO> getWeeklyEvents() {
	        List<EventDTO> events = eventMapper.findEvents();

	        for (EventDTO event : events) {
	            String[] parsedDates = DateParserUtil.parseDates(event.getTime());
	            event.setStartDate(parsedDates[0]);
	            event.setEndDate(parsedDates[1]);
	        }

	        return events;
	    }
}
