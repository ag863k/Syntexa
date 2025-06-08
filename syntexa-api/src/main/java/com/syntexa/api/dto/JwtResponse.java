package com.syntexa.api.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data Transfer Object for JWT responses.
 * This DTO includes the JWT token string, token type, and user details.
 */
@Getter
@Setter
@NoArgsConstructor
public class JwtResponse {

    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;

    /**
     * Full constructor allowing a custom token type.
     *
     * @param token    the JWT token
     * @param type     the token type (typically "Bearer")
     * @param id       the user's ID
     * @param username the user's username
     * @param email    the user's email
     */
    public JwtResponse(String token, String type, Long id, String username, String email) {
        this.token = token;
        this.type = type;
        this.id = id;
        this.username = username;
        this.email = email;
    }

    /**
     * Convenience constructor with default token type ("Bearer").
     *
     * @param token    the JWT token
     * @param id       the user's ID
     * @param username the user's username
     * @param email    the user's email
     */
    public JwtResponse(String token, Long id, String username, String email) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.type = "Bearer"; // Set default token type.
    }
}
