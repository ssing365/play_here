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
   public List<CoupleDTO> Diary(@Param("coupleId") String couple_id,@Param("diaryWriter") String diary_writer, @Param("diaryDate") String diary_date);
   public void DiaryEdit(@Param("coupleId") String couple_id,
         @Param("diaryWriter") String diary_writer, 
         @Param("diaryDate") String diary_date,
         @Param("content") String content);
   public void NewDiary(@Param("coupleId") String couple_id,
         @Param("diaryWriter") String diary_writer, 
         @Param("diaryDate") String diary_date,
         @Param("content") String content);
   public List<PlaceDTO> SearchPlace();
   public List<CoupleDTO> Schedule(@Param("date") String date,@Param("coupleId") String coupleId);
}
