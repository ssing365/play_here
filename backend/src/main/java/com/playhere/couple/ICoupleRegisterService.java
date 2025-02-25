package com.playhere.couple;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ICoupleRegisterService {
    
    void createCouple(Map<String, Object> params);  // 🔹 반환 타입 변경
    void updateCoupleStatus(@Param("userId") String userId, @Param("coupleStatus") int coupleStatus,  @Param("coupleId") int coupleId);
    void deleteCouple(int coupleId); //Couple 테이블에서 삭제
    void deleteCoupleCode(@Param("userId") String userId); // Couple_code 테이블 샂게
    void disconnectCouple(@Param("userId") String userId); //커플 끊기 기능 추가
}