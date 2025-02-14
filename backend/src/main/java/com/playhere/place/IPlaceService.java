package com.playhere.place;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface IPlaceService {
	//리스트 출력
	public List<PlaceDTO> list();
	public List<PlaceDTO> view(String PlaceId);
}
