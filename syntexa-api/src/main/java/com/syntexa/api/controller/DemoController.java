package com.syntexa.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/demo") 
public class DemoController {

    @GetMapping("/hello-secure")
    public ResponseEntity<String> sayHelloSecure() {
        return ResponseEntity.ok("Hello from a SECURE endpoint! You are authenticated!");
    }
}