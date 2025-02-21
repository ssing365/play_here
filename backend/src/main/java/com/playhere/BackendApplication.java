package com.playhere;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
                .directory("src/main/resources")  // .env 파일 위치 지정
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();
		
		//DB정보
		System.setProperty("DATABASE_URL", dotenv.get("DATABASE_URL"));
		System.setProperty("DATABASE_USERNAME", dotenv.get("DATABASE_USERNAME"));
		System.setProperty("DATABASE_PASSWORD", dotenv.get("DATABASE_PASSWORD"));

		//Weather API
		System.setProperty("WEATHER_API_KEY", dotenv.get("WEATHER_API_KEY"));
		SpringApplication.run(BackendApplication.class, args);
	}

}
