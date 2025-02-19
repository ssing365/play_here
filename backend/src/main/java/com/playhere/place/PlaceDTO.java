package com.playhere.place;

import java.util.Arrays;
import java.util.List;

import lombok.Data;

@Data
public class PlaceDTO {
	private String place_id;
	private String place_name;
	private String location;
	private String location_short;
	private String descript;
	private String time;
	private String parking;
	private String call;
	private String Link;
	private String image;
	private String longitude;
	private String latitude;
	private String placename_onmap;
	private String regist_date;
	private String edit_date;
	private String likes;
	private String main_cate;
	private List<String> hashtag;
	
	public void setHashtag(String hashtagStr) {
		if (hashtagStr != null) {
			this.hashtag = Arrays.asList(hashtagStr.split(","));
		}
	}
	
	public void setLocation_short(String locationStr) {
        if (locationStr != null) {
            String[] parts = locationStr.split(" ");
            if (parts.length >= 2) {
                this.location_short = parts[0] + " " + parts[1];
            } else {
                this.location_short = locationStr;
            }
        }
    }
	
	public void setLocation(String locationStr) {
	    this.location = locationStr;
	    setLocation_short(locationStr); // location이 설정될 때 자동으로 location_short 설정
	}

}
