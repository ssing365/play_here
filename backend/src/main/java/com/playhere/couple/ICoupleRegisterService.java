package com.playhere.couple;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ICoupleRegisterService {
    
    void createCouple(Map<String, Object> params);  // 🔹 반환 타입 변경
    void updateCoupleStatus(@Param("userId") String userId, @Param("coupleId") int coupleId);
}