package com.playhere.restapi;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.playhere.event.EventDTO;
import com.playhere.event.EventService;

@RestController
@RequestMapping("/api/events")
public class EventController {
	
	@Autowired
    private EventService eventService;

    @GetMapping("/weekly")
    public ResponseEntity<List<EventDTO>> getWeeklyEvents() {
        List<EventDTO> events = eventService.getWeeklyEvents();
        return ResponseEntity.ok(events);
    }

}
