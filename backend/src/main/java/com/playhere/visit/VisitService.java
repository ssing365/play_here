package com.playhere.visit;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface VisitService {
//	@Select("SELECT place_name FROM place WHERE place_name LIKE CONCAT('%', #{query}, '%') LIMIT 10")
//	List<String> searchWord(String query);
//
//	@Select("SELECT visit_date FROM couple_diary WHERE visit_date=#{selectedDate}")
//	List<String> getVisitsByDate(String date);
//
//	@Insert("INSERT INTO couple_diary (diary_id, diary_writer, couple_id, content, diary_date) "
//			+ "   VALUES (#{userId}, #{date}, #{content})")
////	List<String> getDiary(content);
}
