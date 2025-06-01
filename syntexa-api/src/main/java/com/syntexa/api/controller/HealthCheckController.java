package com.syntexa.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1") 
public class HealthCheckController {

    @GetMapping("/health")
    public String healthCheck() {
        return "Syntexa API is operational! Version 1.0. Systems nominal.";
    }
}