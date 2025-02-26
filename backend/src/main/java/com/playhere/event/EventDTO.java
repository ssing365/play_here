package com.playhere.event;

import lombok.Data;

@Data
public class EventDTO {
	private int placeId;
	private String placeName;
	private String placeNameOnMap;
	private String time;
	private String image;
	private String startDate;
	private String endDate;

}
