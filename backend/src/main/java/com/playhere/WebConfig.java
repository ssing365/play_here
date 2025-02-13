package com.playhere;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // ��� ��ο� ����
                .allowedOrigins("http://localhost:5173")  // ����Ʈ ���� �ּ�
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // ����� HTTP �޼ҵ�
        		.allowCredentials(true) // 인증 정보 허용
        		.allowCredentials(true)
        		.allowedHeaders("*"); // 모든 헤더 허용

    }
}
