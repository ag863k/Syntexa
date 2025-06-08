package com.syntexa.api.config;

import com.syntexa.api.security.JwtAuthenticationFilter;
import com.syntexa.api.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Dependencies are injected into the methods that need them, not the class constructor.
    // This is a key part of the fix.

    /**
     * Defines the AuthenticationProvider bean. This is the component that tells Spring Security
     * how to fetch user details and verify passwords.
     */
    @Bean
    public AuthenticationProvider authenticationProvider(UserService userService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService); // Uses our UserService to find users
        authProvider.setPasswordEncoder(passwordEncoder); // Uses the BCrypt encoder from AppConfig
        return authProvider;
    }

    /**
     * Exposes the AuthenticationManager as a bean, which is needed to manually process login requests in our AuthController.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Configures CORS (Cross-Origin Resource Sharing) to allow requests from our frontend.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // IMPORTANT: Add your final Netlify URL here when you deploy the frontend
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "https://your-netlify-app-name.netlify.app"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply this rule to all paths
        return source;
    }

    /**
     * Defines the main security filter chain that protects our API endpoints.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(
        HttpSecurity http,
        AuthenticationProvider authenticationProvider,
        JwtAuthenticationFilter jwtAuthFilter
    ) throws Exception {
        http
            .cors(withDefaults()) // Enable CORS using the bean defined above
            .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless REST APIs
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Allow CORS preflight requests
                .requestMatchers("/api/v1/auth/**", "/api/v1/health").permitAll() // Public auth and health endpoints
                .requestMatchers(HttpMethod.GET, "/api/v1/problems/**").permitAll() // Allow anyone to view problems
                .anyRequest().authenticated() // All other requests require a valid token
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // No server-side sessions
            .authenticationProvider(authenticationProvider) // Use our custom authentication provider
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // Add our JWT filter

        return http.build();
    }
}