package com.syntexa.api.service;

import com.syntexa.api.model.User;
import com.syntexa.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User userToRegister){
        if (userRepository.existsByUsername(userToRegister.getUsername())){
            throw new IllegalArgumentException("Error: Username is already taken!");
        }

        if(userRepository.existsByEmail(userToRegister.getEmail())){
            throw new IllegalArgumentException("Error: Email is already in use!");
        }

        String hashedPassword = passwordEncoder.encode(userToRegister.getPassword());
        userToRegister.setPassword(hashedPassword);

        User savedUser = userRepository.save(userToRegister);
    
        return savedUser;
    }
}