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

    /**
     * Endpoint to register a new user.
     * Receives a sign-up request, creates a new user, and returns a success message.
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        try {
            // Create a new User instance from the signup request
            User newUser = new User();
            newUser.setUsername(signUpRequest.getUsername());
            newUser.setEmail(signUpRequest.getEmail());
            // It's assumed that the UserService encrypts the password
            newUser.setPassword(signUpRequest.getPassword());

            // Register the new user via the service layer
            User registeredUser = userService.registerUser(newUser);
            String message = "User registered successfully! Welcome " + registeredUser.getUsername();
            return ResponseEntity.status(HttpStatus.CREATED).body(message);
        } catch (IllegalArgumentException e) {
            // This catch block handles typical registration errors 
            // (e.g., duplicate username/email) returned by the service layer
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            // Catch any unexpected exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("An error occurred during registration.");
        }
    }

    /**
     * Endpoint to authenticate an existing user.
     * Validates credentials, generates a JWT, and returns a JwtResponse with token and user info.
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate the user using the AuthenticationManager
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            // Fetch the authenticated user from the security context
            User user = (User) authentication.getPrincipal();
            // Generate a JWT token for the authenticated user
            String jwtToken = jwtService.generateToken(user);
            JwtResponse jwtResponse = new JwtResponse(jwtToken, user.getId(), user.getUsername(), user.getEmail());
            return ResponseEntity.ok(jwtResponse);
        } catch (AuthenticationException e) {
            // This response is sent if authentication fails (e.g., incorrect credentials)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("Error: Invalid username or password");
        } catch (Exception e) {
            // Catch any other unexpected exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("An error occurred during login.");
        }
    }
}
