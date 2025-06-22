package com.syntexa.api.controller;

import com.syntexa.api.dto.JwtResponse;
import com.syntexa.api.dto.LoginRequest;
import com.syntexa.api.dto.SignUpRequest;
import com.syntexa.api.model.User;
import com.syntexa.api.security.JwtService;
import com.syntexa.api.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
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
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully! You can now log in.");
        } catch (IllegalArgumentException e) {
            org.slf4j.LoggerFactory.getLogger(AuthController.class)
                .error("Signup failed for user {}: {}", signUpRequest.getUsername(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            org.slf4j.LoggerFactory.getLogger(AuthController.class)
                .error("Unexpected error during signup for user {}: {}", signUpRequest.getUsername(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            User user = (User) authentication.getPrincipal();
            String jwtToken = jwtService.generateToken(user);
            JwtResponse jwtResponse = new JwtResponse(
                jwtToken, user.getId(), user.getUsername(), user.getEmail()
            );
            return ResponseEntity.ok(jwtResponse);
        } catch (AuthenticationException e) {
            org.slf4j.LoggerFactory.getLogger(AuthController.class)
                .error("Authentication failed for user {}: {}", loginRequest.getUsername(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        } catch (Exception e) {
            org.slf4j.LoggerFactory.getLogger(AuthController.class)
                .error("Unexpected error during login for user {}: {}", loginRequest.getUsername(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No valid token provided");
            }
            
            String token = authHeader.substring(7);
            String username = jwtService.extractUsername(token);
            User user = (User) userService.loadUserByUsername(username);
            
            // Generate new token
            String newToken = jwtService.generateToken(user);
            JwtResponse jwtResponse = new JwtResponse(
                newToken, user.getId(), user.getUsername(), user.getEmail()
            );
            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
            org.slf4j.LoggerFactory.getLogger(AuthController.class)
                .error("Token refresh failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token refresh failed");
        }
    }
}