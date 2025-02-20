package com.playhere.Calendar;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface VisitMapper {

	public List<CalendarVisitDTO> getVisitPlace(@Param("coupleId") Long coupleId, @Param("visitDate") String visitDate);

}
//	@Select("SELECT * FROM COUPLE_VISIT WHERE visit_date=#{date}")
//	public String getDiaryByDate();
