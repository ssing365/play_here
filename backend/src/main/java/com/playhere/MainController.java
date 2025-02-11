package com.playhere;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {
	@GetMapping("/")
    public String hello() {
        return "index.html";
    }

    @GetMapping("/api/hi")
    public String hi() {
        return "Hi from Spring Boot~~!!";
    }
}
