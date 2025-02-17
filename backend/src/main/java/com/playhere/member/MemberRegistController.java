package com.playhere.member;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Date;
import java.util.HashMap;
import java.util.List;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import utils.MyFunctions;

@RestController
@RequestMapping("/join")
public class MemberRegistController {
	
	@Autowired
	IMemberService dao; 

	@PostMapping("/register.do")
	public Map<String, Integer> registerUser(
			@RequestPart("formData") String formDataJson,
			@RequestPart(value = "profile_picture", required = false) MultipartFile profilePicture){
		
		// JSON 문자열을 Map으로 변환
	    ObjectMapper objectMapper = new ObjectMapper();
	    Map<String, String> formData;
	    try {
	        formData = objectMapper.readValue(formDataJson, new TypeReference<Map<String, String>>() {});
	    } catch (Exception e) {
	        e.printStackTrace();
	        return Map.of("result", 0); // JSON 변환 실패 시 회원가입 실패 응답
	    }
	    
		//1. DTO 객체 생성 및 데이터 설정 
		//Map에서 값을 꺼내 DTO 객체에 세팅 
		MemberDTO member = new MemberDTO();
		
		member.setUserId(formData.get("user_id"));
		member.setPassword(formData.get("password"));
		member.setName(formData.get("name"));
		member.setNickname(formData.get("nickname"));
		member.setEmail(formData.get("email"));
		
		//birthdate 타입변환
		String birthDateStr = formData.get("birth_date");
		Date birthDate = null; //기본값 설정 
		
		if (birthDateStr != null && !birthDateStr.isEmpty()) {
		    try {
		        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		        LocalDate localDate = LocalDate.parse(birthDateStr, formatter);
		        birthDate = Date.valueOf(localDate);
		    } catch (Exception e) {
		        e.printStackTrace();
		        System.out.println("생년월일 변환 오류: " + birthDateStr);
		    }
		}
		
		
		member.setBirthDate(birthDate == null ? null : birthDate);
		
		member.setZipcode(formData.get("postcode"));
		member.setAddress(formData.get("address"));
		member.setDetailAddress(formData.get("detailAddress"));
		
		//2. 이미지 파일 업로드 처리 
		if (profilePicture != null && !profilePicture.isEmpty()) {
			
			try {
				//저장할 디렉토리 경로 설정 
				String uploadDir = "C:/Image/Member";
				Files.createDirectories(Paths.get(uploadDir)); //디렉토리 생성
				
				//원본 파일 명 가져오기
				String originalFileName = profilePicture.getOriginalFilename();
				if (originalFileName != null && !originalFileName.isEmpty()) {
					//UUID 이용한 새 파일명 생성
					String savedFileName = MyFunctions.renameFile(uploadDir, originalFileName);
					
					//파일 저장
					Path filePath = Paths.get(uploadDir, savedFileName);
					profilePicture.transferTo(filePath.toFile());
					
					//DTO에 파일명 저장
					member.setProfilePicture(savedFileName);
					
				}
				
			} catch (Exception e) {
				 System.out.println("업로드 실패: " + e.getMessage());
		            e.printStackTrace();
			}
			
			
		}
		
		//3. DB 저장 처리
		int result = dao.insertMemberinfo(member);
		
		//4.결과 반환 
		Map<String, Integer> map = new HashMap<>();
		map.put("result", result);
		return map;
	}
	

	//회원의 선호도 
	@Transactional
	@PostMapping("/preference.do")
	public Map<String , Integer> saveUserPreferences(@RequestBody List<UserPreferenceDTO> preferences){
		System.out.println("Received preferences: " + preferences);  // 로그 추가
		Map<String, Integer> response = new HashMap<>();
        
        try {
            dao.insertUserPreferences(preferences);
            response.put("result", 1);  // 성공
            
        } catch (Exception e) {
            response.put("result", 0);  // 실패 (예외 발생)
            e.printStackTrace();
        }
        
        return response;
	    
	}

	
}
