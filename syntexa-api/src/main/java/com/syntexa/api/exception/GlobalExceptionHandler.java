package com.syntexa.api.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Handles validation errors (e.g., @NotBlank, @Email)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        logger.error("Validation error: {}", ex.getMessage());
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // Handles failed logins
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<String> handleAuthenticationException(AuthenticationException ex) {
        logger.error("Authentication error: {}", ex.getMessage());
        return new ResponseEntity<>("Error: Invalid username or password", HttpStatus.UNAUTHORIZED);
    }

    // Handles creating users/problems with duplicate unique fields (username, email, problem title)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        String message = "Error: A database constraint was violated.";
        if (ex.getMostSpecificCause().getMessage().contains("app_users_username_key")) {
            message = "Error: Username is already taken!";
        } else if (ex.getMostSpecificCause().getMessage().contains("app_users_email_key")) {
            message = "Error: Email is already in use!";
        } else if (ex.getMostSpecificCause().getMessage().contains("problems_title_key")) {
            message = "Error: A problem with this title already exists!";
        }
        logger.error("Data integrity violation: {}", ex.getMessage());
        return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
    }

    // Handles other common errors, like creating a note for a problem that doesn't exist
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        logger.error("Runtime exception: {}", ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}