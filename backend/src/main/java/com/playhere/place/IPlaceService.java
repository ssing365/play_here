package com.playhere.place;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
//import java.util.Map;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;

@Mapper
public interface IPlaceService {
	//리스트 출력
	public List<PlaceDTO> list(ParameterDTO parameterDTO);
	public List<PlaceDTO> view(int PlaceId);
	public int Interestcheck(@Param("userId") String userId, @Param("placeId") String placeId);
	public void placeLikeAdd(@Param("placeId") String placeId);
	public void placeLikeCancel(@Param("placeId") String placeId);
	public void InterestAdd(@Param("userId") String userId, @Param("placeId") String placeId);
	public void InterestCancel(@Param("userId") String userId, @Param("placeId") String placeId);
	public List<PlaceDTO> top5();
	public List<PlaceDTO> interests(@Param("userId") String userId);
	public void addCalendar(@Param("placeId") String placeId, @Param("coupleId") String coupleId, @Param("visitDate") Date visitDate);
	public int CheckCalendar(@Param("placeId") String placeId, @Param("coupleId") String coupleId, @Param("visitDate") Date visitDate);
	
	public List<PlaceDTO> listAll(ParameterDTO parameterDTO);
	public List<PlaceDTO> listLikes(ParameterDTO parameterDTO);
	
	
	public List<PlaceDTO> getWeeklyEvents(@Param("placeId") List<String> placeId);
	
	
}
