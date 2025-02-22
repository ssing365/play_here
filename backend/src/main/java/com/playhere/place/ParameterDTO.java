package com.playhere.place;

import java.util.ArrayList;

import lombok.Data;

@Data
public class ParameterDTO {
	//페이징 및 검색
	private String pageNum;
	private ArrayList<String> searchLocation;
	private ArrayList<String> searchWord;
	private ArrayList<String> searchCategory;
	private int start;
	private int end;
	
}
