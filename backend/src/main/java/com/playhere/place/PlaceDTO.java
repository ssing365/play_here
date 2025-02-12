package com.playhere.place;

import java.util.Arrays;
import java.util.List;

import lombok.Data;

@Data
public class PlaceDTO {
	private String place_id;
	private String place_name;
	private String location;
	private String descript;
	private String time;
	private String parking;
	private String dayoff;
	private String call;
	private String Link;
	private String image;
	private String longitude;
	private String latitude;
	private String placename_onmap;
	private String regist_date;
	private String edit_date;
	private List<String> categories;
	
	public void setCategories(String categoriesStr) {
        if (categoriesStr != null) {
            this.categories = Arrays.asList(categoriesStr.split(","));
        }
    }
}
