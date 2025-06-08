package com.syntexa.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * General application-wide configuration beans.
 */
@Configuration
public class AppConfig {

    /**
     * Provides a centrally managed PasswordEncoder bean for the application.
     * We use BCrypt, which is a strong, industry-standard hashing algorithm.
     * @return A PasswordEncoder instance.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}