package com.playhere.couple;

import java.sql.Date;

import lombok.Data;

@Data
public class CoupleDTO {
    private String coupleId;    
    private String userId1;     
    private String userId2;     
    private String diaryWriter; 
    private String content;     
    private String diaryDate;    
    private String placeId;
    private Date visitDate;    
    private String visitIndex;  
    
    private String placeName;
    private String longitude;
    private String latitude;
}
