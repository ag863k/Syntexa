package com.syntexa.api.service;

import com.syntexa.api.model.User;
import com.syntexa.api.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registers a new user after validating that the username and email are unique.
     * The password is encoded before storing the user.
     *
     * @param userToRegister the user object to register
     * @return the registered user object
     * @throws IllegalArgumentException if the username or email is already in use
     */
    @Transactional
    public User registerUser(User userToRegister) {
        if (userRepository.existsByUsername(userToRegister.getUsername())) {
            throw new IllegalArgumentException("Error: Username is already taken!");
        }
        if (userRepository.existsByEmail(userToRegister.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }
        // Encode the user's password before saving
        String hashedPassword = passwordEncoder.encode(userToRegister.getPassword());
        userToRegister.setPassword(hashedPassword);

        // Save and return the new user
        return userRepository.save(userToRegister);
    }

    /**
     * Loads user details based on the provided username.
     *
     * @param username the username to search for
     * @return a UserDetails object representing the user
     * @throws UsernameNotFoundException if the user with the given username is not found
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }
}
