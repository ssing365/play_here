package com.playhere.place;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface IPlaceService {
	//리스트 출력
	public List<PlaceDTO> list();
	public List<PlaceDTO> view(String PlaceId);
	public int Interestcheck(@Param("userId") String userId, @Param("placeId") String placeId);
	public void placeLikeAdd(@Param("placeId") String placeId);
	public void placeLikeCancle(@Param("placeId") String placeId);
	public void InterestAdd(@Param("userId") String userId, @Param("placeId") String placeId);
	public void InterestCancle(@Param("userId") String userId, @Param("placeId") String placeId);

}
