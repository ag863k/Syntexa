package com.syntexa.api.controller;

import com.syntexa.api.dto.JwtResponse;
import com.syntexa.api.dto.LoginRequest;
import com.syntexa.api.dto.SignUpRequest;
import com.syntexa.api.model.User;
import com.syntexa.api.security.JwtService;
import com.syntexa.api.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserService userService, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        try {
            User newUser = new User();
            newUser.setUsername(signUpRequest.getUsername());
            newUser.setEmail(signUpRequest.getEmail());
            newUser.setPassword(signUpRequest.getPassword());

            userService.registerUser(newUser);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "User registered successfully. Please log in."));
        } catch (IllegalArgumentException e) {
            logger.error("Signup failed for user {}: {}", signUpRequest.getUsername(), e.getMessage(), e);
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error during signup for user {}: {}", signUpRequest.getUsername(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "An unexpected error occurred during registration."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(), loginRequest.getPassword()
                    )
            );

            User user = (User) authentication.getPrincipal();
            String jwtToken = jwtService.generateToken(user);

            JwtResponse jwtResponse = new JwtResponse(
                    jwtToken, user.getId(), user.getUsername(), user.getEmail()
            );

            return ResponseEntity.ok(jwtResponse);

        } catch (AuthenticationException e) {
            logger.warn("Authentication failed for user {}: {}", loginRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Invalid username or password."));
        } catch (Exception e) {
            logger.error("Unexpected error during login for user {}: {}", loginRequest.getUsername(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "An unexpected error occurred during login."));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);

            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "No valid token provided."));
            }

            String username = jwtService.extractUsername(token);
            User user = (User) userService.loadUserByUsername(username);

            String newToken = jwtService.generateToken(user);

            JwtResponse jwtResponse = new JwtResponse(
                    newToken, user.getId(), user.getUsername(), user.getEmail()
            );

            return ResponseEntity.ok(jwtResponse);

        } catch (Exception e) {
            logger.error("Token refresh failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Token refresh failed."));
        }
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    // Optionally create a generic response wrapper
    private static class ApiResponse {
        private final boolean success;
        private final String message;

        public ApiResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getMessage() {
            return message;
        }
    }
}
