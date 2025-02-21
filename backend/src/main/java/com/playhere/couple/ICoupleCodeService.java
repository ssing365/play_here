package com.playhere.couple;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ICoupleCodeService {
	CoupleCodeDTO findByUserId(String userId);
    CoupleCodeDTO findByCode(String code);
    int insertCoupleCode(CoupleCodeDTO coupleCode);
    int updateCoupleCode(CoupleCodeDTO coupleCode);
    List<String> findAllUserIds();
	
}
