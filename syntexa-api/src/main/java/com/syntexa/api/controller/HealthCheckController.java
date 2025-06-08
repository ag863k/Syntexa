package com.syntexa.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for checking the operational status of the Syntexa API.
 */
@RestController
@RequestMapping("/api/v1")
public class HealthCheckController {

    /**
     * Health-check endpoint to verify that the API is operational.
     * <p>
     * Access this endpoint via GET /api/v1/health to receive a status message.
     * </p>
     *
     * @return a ResponseEntity with a status message.
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Syntexa API is operational! Version 1.0. Systems nominal.");
    }
}
