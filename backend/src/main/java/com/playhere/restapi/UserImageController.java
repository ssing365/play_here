package com.playhere.restapi;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserImageController {

	//실제 이미지가 저장된 로컬 디렉토리 경로 지정
	private final String imageDirectory ="C:/Image/Member";
	
	@GetMapping("/image/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable("filename") String filename) {
        try {
            // 로컬 디렉토리에서 파일 경로를 구성합니다.
            Path filePath = Paths.get(imageDirectory).resolve(filename).normalize();

            // 파일을 Resource로 읽어들임
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                // 파일의 MIME 타입 결정 (예: image/png, image/jpeg)
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    // MIME 타입을 결정할 수 없는 경우 기본값 설정
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .body(resource);
            } else {
                // 파일이 존재하지 않거나 읽을 수 없는 경우 404 반환
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            // 파일 경로가 잘못된 경우 400 반환
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            // 그 외 I/O 에러 발생 시 500 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}