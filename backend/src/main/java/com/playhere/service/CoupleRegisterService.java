package com.playhere.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.playhere.couple.CoupleCodeDTO;
import com.playhere.couple.CoupleRegistrationException;
import com.playhere.couple.ICoupleCodeService;
import com.playhere.couple.ICoupleRegisterBusinessService;
import com.playhere.couple.ICoupleRegisterService;
import com.playhere.member.IMemberService;
import com.playhere.member.MemberDTO;

@Service
public class CoupleRegisterService implements ICoupleRegisterBusinessService {

	private final ICoupleRegisterService coupleRegisterMapper;
    private final ICoupleCodeService coupleCodeMapper;
    private final IMemberService memberMapper;

    public CoupleRegisterService(ICoupleRegisterService coupleRegisterMapper, 
                                 ICoupleCodeService coupleCodeMapper, 
                                 IMemberService memberMapper) {
        this.coupleRegisterMapper = coupleRegisterMapper;
        this.coupleCodeMapper = coupleCodeMapper;
        this.memberMapper = memberMapper;
    }
    
    //초대자 정보 조회 기능
    public MemberDTO getInviterInfo(String coupleCode) {
		CoupleCodeDTO inviter = coupleCodeMapper.findByCode(coupleCode);
		if (inviter == null) {
			return null;
		}
		return memberMapper.findByUserId(inviter.getUserId());
	}
    
    @Override
    public CoupleCodeDTO getCoupleCodeByCode(String code) {
        return coupleCodeMapper.findByCode(code);
    }
    
    
    //커플 등록 기능
    @Override
    @Transactional
    public void registerCouple(String userId, String coupleCode) {
    	try {
        // 1. 초대 코드로 초대자(A) 찾기
        CoupleCodeDTO inviter = coupleCodeMapper.findByCode(coupleCode);
        System.out.println("[디버깅] 초대자로 조회된 객체: " + inviter);
        
        if (inviter == null) {
            throw new CoupleRegistrationException("유효하지 않은 커플 코드입니다.");
        }
        String inviterId = inviter.getUserId(); // 초대자의 userId
        System.out.println("[디버깅] 초대자의 userId: " + inviterId);

        // 2. 초대자(A)와 수락자(B) 정보 조회
        MemberDTO inviterMember = memberMapper.findByUserId(inviterId);
        MemberDTO receiverMember = memberMapper.findByUserId(userId);
        System.out.println("[디버깅] 초대자 정보: " + inviterMember);
        System.out.println("[디버깅] 수락자 정보: " + receiverMember);
        
        //자기 자신을 커플로 추가하는 것 방지 
        if (inviterId.equals(userId)) {
            throw new CoupleRegistrationException("자기 자신을 초대할 수 없습니다.");
        }

        if (inviterMember == null || receiverMember == null) {
            throw new CoupleRegistrationException("존재하지 않는 회원입니다.");
        }

        // 3. A 또는 B가 이미 커플인지 확인
        System.out.println("💡 A의 커플 ID: " + inviterMember.getCoupleId());
        System.out.println("💡 B의 커플 ID: " + receiverMember.getCoupleId());
        

        if (Integer.valueOf(inviterMember.getCoupleId()) != 0 || Integer.valueOf(receiverMember.getCoupleId()) != 0) {
            throw new CoupleRegistrationException("이미 커플로 등록된 사용자입니다.");
        }

        // 4. 커플 등록 (couple 테이블)
        System.out.println("[디버깅] 커플 등록 시도...");
        // MyBatis에서 생성된 `couple_id`를 저장할 Map 생성
        Map<String, Object> params = new HashMap<>();
        params.put("userId1", inviterId);
        params.put("userId2", userId);

        // createCouple 호출 → `params`에 `coupleId`가 자동으로 추가됨
        coupleRegisterMapper.createCouple(params);

        // 생성된 coupleId 가져오기
        Object coupleIdObj = params.get("coupleId");
        
        // NULL 체크 추가
        if (coupleIdObj == null) {
            throw new RuntimeException("[오류] coupleId가 생성되지 않았습니다. MyBatis에서 키 반환 실패");
        }
        
     // BigDecimal → int 변환
        int coupleId;
        if (coupleIdObj instanceof BigDecimal) {
            coupleId = ((BigDecimal) coupleIdObj).intValue();
        } else if (coupleIdObj instanceof Integer) {
            coupleId = (Integer) coupleIdObj;
        } else {
            throw new RuntimeException("[오류] 예상치 못한 데이터 타입: " + coupleIdObj.getClass());
        }
        System.out.println("[디버깅] 커플 등록 완료! coupleId: " + coupleId);

        // 5. 초대자와 수락자의 couple_status, couple_id 업데이트 (member 테이블)
        System.out.println("[디버깅] 초대자 상태 업데이트...");
        int coupleStatus = 1;
        memberMapper.updateCoupleStatus(inviterId, coupleStatus, coupleId);
        System.out.println("[디버깅] 수락자 상태 업데이트...");
        memberMapper.updateCoupleStatus(userId, coupleStatus, coupleId);

        // 6. 커플 코드 업데이트 (둘 다 "COUPLE"로 설정, 없으면 생성)
        System.out.println("[디버깅] 초대자 커플 코드 업데이트...");
        updateOrInsertCoupleCode(inviterId);
        System.out.println("[디버깅] 초대자 커플 코드 업데이트...");
        updateOrInsertCoupleCode(userId);
    } catch (Exception e) {
        System.err.println("[오류 발생] " + e.getMessage());
        e.printStackTrace(); // 전체 스택 트레이스를 출력해서 오류 확인
        throw new RuntimeException("커플 등록 중 서버 오류 발생");
    }
}

    private void updateOrInsertCoupleCode(String userId) {
        CoupleCodeDTO codeDTO = coupleCodeMapper.findByUserId(userId);
        if (codeDTO == null) {
            // 없는 경우 새로 추가
            codeDTO = new CoupleCodeDTO();
            codeDTO.setUserId(userId);
            codeDTO.setCode("COUPLE");
            coupleCodeMapper.insertCoupleCode(codeDTO);
        } else {
            // 기존 코드 업데이트
            codeDTO.setCode("COUPLE");
            coupleCodeMapper.updateCoupleCode(codeDTO);
        }
    }
    
  //커플끊기
    @Transactional
    public void disconnectCouple(String userId) {
        System.out.println("💡 [백엔드] disconnectCouple() 실행 - userId: " + userId);
        
        // 현재 사용자 정보 조회
        MemberDTO user = memberMapper.findByUserId(userId);
        if (user == null) {
            System.out.println("❌ [백엔드] 사용자를 찾을 수 없음!");
            throw new RuntimeException("해당 유저는 존재하지 않습니다.");
        }

        Integer coupleId = user.getCoupleId();
        if (coupleId == null) {
            System.out.println("❌ [백엔드] 커플 ID 없음!");
            throw new RuntimeException("커플 ID가 존재하지 않습니다.");
        }
        
        System.out.println("🔍 [백엔드] coupleId 확인: " + coupleId);

        // 커플 상대방 조회
        MemberDTO partner = memberMapper.findPartnerByCoupleId(coupleId, userId);
        if (partner == null) {
            System.out.println("❌ [백엔드] 파트너 정보 없음!");
            throw new RuntimeException("파트너 정보를 찾을 수 없습니다.");
        }
        
        String parterId = partner.getUserId();
        
        System.out.println("🔍 [백엔드] 파트너 userId 확인: " + partner.getUserId());

        // ✅ 수정된 SQL 호출
        System.out.println("🔄 [백엔드] 사용자 커플 상태 업데이트...");
        coupleRegisterMapper.updateMemberAfterDisconnect(userId);
        System.out.println("✅ [백엔드] 사용자 커플 상태 업데이트 완료!");

        System.out.println("🔄 [백엔드] 파트너 커플 상태 업데이트...");
        coupleRegisterMapper.updatePartnerAfterDisconnect(parterId);
        System.out.println("✅ [백엔드] 파트너 커플 상태 업데이트 완료!");

        // couple 테이블에서 삭제
        System.out.println("🔄 [백엔드] 커플 관계 삭제...");
        coupleRegisterMapper.deleteCoupleByUser(userId);
        System.out.println("✅ [백엔드] 커플 관계 삭제 완료!");

        // couple_code 테이블에서 코드 삭제
        System.out.println("🔄 [백엔드] 커플 코드 삭제...");
        coupleRegisterMapper.deleteCoupleCodeByUser(userId);
        coupleRegisterMapper.deleteCoupleCodeByUser(parterId);
        System.out.println("✅ [백엔드] 커플 코드 삭제 완료!");
    }



}