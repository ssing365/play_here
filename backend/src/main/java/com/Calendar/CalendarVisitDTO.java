package com.playhere.Calendar;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CalendarVisitDTO {

	private Long visitId;
    private String visitDate;
    private Integer visitIndex;
    private Long placeId;
    private String placeName;
    private String location;
    private Double latitude;
    private Double longitude;
}
