package com.syntexa.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for a login request.
 * It validates that both username and password are not blank.
 */
@Data
@NoArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Username cannot be blank")
    private String username;

    @NotBlank(message = "Password cannot be blank")
    private String password;
}
