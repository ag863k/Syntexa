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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    // Needed to encode and verify passwords.
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
    
    // Configure the AuthenticationProvider using your UserService and PasswordEncoder.
    @Bean
    public AuthenticationProvider authenticationProvider(UserService userService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        // Tell the provider how to lookup users
        authProvider.setUserDetailsService(userService);
        // Use BCrypt to verify passwords
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    // Expose the AuthenticationManager, which is needed for the login process.
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Define the CORS configuration: allow your React app's URL and common HTTP methods.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow requests from these origins (adjust with your production URL if needed)
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "https://your-netlify-app-name.netlify.app"));
        // Allow these HTTP methods
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Allow all headers (adjust if necessary)
        configuration.setAllowedHeaders(List.of("*"));
        // Allow credentials such as cookies; required if your frontend sends them
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply the CORS configuration to all endpoints
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // Configure the security filter chain.
    @Bean
    public SecurityFilterChain securityFilterChain(
        HttpSecurity http,
        AuthenticationProvider authenticationProvider,
        JwtAuthenticationFilter jwtAuthFilter
    ) throws Exception {

        http
            // Enable CORS using our provided CorsConfigurationSource
            .cors(withDefaults())
            // Disable CSRF protection (suitable for stateless REST APIs)
            .csrf(csrf -> csrf.disable())
            // Configure URL-based authorization
            .authorizeHttpRequests(authorize -> authorize
                // Permit all OPTIONS requests (used for CORS preflight)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Permit endpoints for authentication and health check
                .requestMatchers("/api/v1/auth/**", "/api/v1/health").permitAll()
                // Permit GET requests for problems (publicly viewable)
                .requestMatchers(HttpMethod.GET, "/api/v1/problems/**").permitAll()
                // All other requests must be authenticated
                .anyRequest().authenticated()
            )
            // Specify stateless session; backend does not use HTTP sessions.
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Configure our AuthenticationProvider
            .authenticationProvider(authenticationProvider)
            // Insert our JWT filter before the standard username/password filter.
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
