package com.syntexa.api.service;

import com.syntexa.api.model.User;
import com.syntexa.api.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User userToRegister) {
        log.info("Registering a new user with username: {}", userToRegister.getUsername());
        if (userRepository.existsByUsername(userToRegister.getUsername())) {
            log.error("Username is already taken: {}", userToRegister.getUsername());
            throw new IllegalArgumentException("Error: Username is already taken!");
        }
        if (userRepository.existsByEmail(userToRegister.getEmail())) {
            log.error("Email is already in use: {}", userToRegister.getEmail());
            throw new IllegalArgumentException("Error: Email is already in use!");
        }
        String hashedPassword = passwordEncoder.encode(userToRegister.getPassword());
        userToRegister.setPassword(hashedPassword);
        User savedUser = userRepository.save(userToRegister);
        log.info("User registered successfully with ID: {}", savedUser.getId());
        return savedUser;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Loading user by username: {}", username);
        return userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.error("User not found with username: {}", username);
                    return new UsernameNotFoundException("User not found with username: " + username);
                });
    }
}