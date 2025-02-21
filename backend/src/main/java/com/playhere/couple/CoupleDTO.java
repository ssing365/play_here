package com.playhere.couple;

import java.sql.Date;

import lombok.Data;

@Data
public class CoupleDTO {
    private String couple_id;    
    private String user_id_1;     
    private String user_id_2;     
    private String diary_writer; 
    private String content;     
    private String diary_date;    
    private String place_id;
    private Date visit_date;    
    private String visit_index;  
    
    private String place_name;
}
