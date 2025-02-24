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
    void disconnectCouple(@Param("userId") String userId);

    // ✅ 추가된 메서드들 (MyBatis Mapper와 매칭)
    void updateMemberAfterDisconnect(@Param("userId") String userId);
    void updatePartnerAfterDisconnect(@Param("userId") String userId);
    void deleteCoupleByUser(@Param("userId") String userId);
    void deleteCoupleCodeByUser(@Param("userId") String userId);
}