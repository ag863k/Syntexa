package com.syntexa.api.controller;

import com.syntexa.api.dto.JwtResponse;
import com.syntexa.api.dto.LoginRequest;
import com.syntexa.api.dto.SignUpRequest;
import com.syntexa.api.model.User;
import com.syntexa.api.security.JwtService;
import com.syntexa.api.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    public AuthController(UserService userService, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        try {
            // Create new User instance and populate it from the request
            User newUser = new User();
            newUser.setUsername(signUpRequest.getUsername());
            newUser.setEmail(signUpRequest.getEmail());
            newUser.setPassword(signUpRequest.getPassword());
            
            // Pass the user to the service layer for registration
            User registeredUser = userService.registerUser(newUser);
            String message = "User registered successfully! Welcome " + registeredUser.getUsername();
            return ResponseEntity.status(HttpStatus.CREATED).body(message);
        } catch (IllegalArgumentException e) {
            // Handle errors like duplicate username/email from the service layer
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            // Cast the authenticated principal to your User type (ensure your configuration supports this)
            User user = (User) authentication.getPrincipal();
            String jwtToken = jwtService.generateToken(user);
            JwtResponse jwtResponse = new JwtResponse(jwtToken, user.getId(), user.getUsername(), user.getEmail());
            return ResponseEntity.ok(jwtResponse);
        } catch (AuthenticationException e) {
            // Return an unauthorized status code for invalid credentials
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Invalid username or password");
        }
    }
}
