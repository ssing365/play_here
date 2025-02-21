package com.playhere.couple;

import java.sql.Date;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.playhere.place.PlaceDTO;


@Mapper
public interface ICoupleService {
	public List<CoupleDTO> coupleInfo(@Param("coupleId") String coupleId,@Param("userId") String userId);
	public List<CoupleDTO> visit(@Param("coupleId") String coupleId, @Param("visitDate") String visitDate);
	public void visitDelete(@Param("coupleId") String coupleId, @Param("placeId") String placeId, @Param("visitDate") String visitDate);
	public void updateVisitOrder(@Param("coupleId") String coupleId, 
            @Param("placeId") String placeId, 
            @Param("index") int index,
            @Param("visitDate") String visitDate);
	public List<CoupleDTO> visitPlace(@Param("placeIds") List<Integer> placeIds,@Param("coupleId") int coupleId, @Param("visitDate") String visitDate);
	public List<CoupleDTO> Diary(@Param("couple_id") String couple_id,@Param("diary_writer") String diary_writer, @Param("diary_date") String diary_date);
	public void DiaryEdit(@Param("couple_id") String couple_id,
			@Param("diary_writer") String diary_writer, 
			@Param("diary_date") String diary_date,
			@Param("content") String content);
	public void NewDiary(@Param("couple_id") String couple_id,
			@Param("diary_writer") String diary_writer, 
			@Param("diary_date") String diary_date,
			@Param("content") String content);
}
