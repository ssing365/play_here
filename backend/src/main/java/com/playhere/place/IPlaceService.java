package com.playhere.place;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

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
	public List<PlaceDTO> closePlace(@Param("longitude1") double longitude1,
		    @Param("longitude2") double longitude2,
		    @Param("latitude1") double latitude1,
		    @Param("latitude2") double latitude2,
		    @Param("placeId") String placeId);
	public int CountCalendar(@Param("coupleId") String coupleId, @Param("visitDate") Date visitDate);
}
