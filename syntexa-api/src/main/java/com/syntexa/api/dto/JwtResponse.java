package com.syntexa.api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter
public class JwtResponse {

    private String token;
    private String type = "Bearer"; 
    private Long id;
    private String username;
    private String email;

    // Existing constructor with all parameters (if using Lombok annotations or manual)
    public JwtResponse(String token, String type, Long id, String username, String email) {
        this.token = token;
        this.type = type;
        this.id = id;
        this.username = username;
        this.email = email;
    }

    // New overloaded constructor with four parameters
    public JwtResponse(String token, Long id, String username, String email) {
        this.token = token;
        this.type = "Bearer"; // default value
        this.id = id;
        this.username = username;
        this.email = email;
    }
}
