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

    // Define a password encoder bean.
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
    
    // Configure the AuthenticationProvider using your UserService and PasswordEncoder.
    @Bean
    public AuthenticationProvider authenticationProvider(UserService userService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        // Set the service to lookup users
        authProvider.setUserDetailsService(userService);
        // Use BCrypt for verifying passwords
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    // Expose the AuthenticationManager, needed for authentication.
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    // Explicitly define a JwtAuthenticationFilter bean if it isn't already a component.
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    // Define the CORS configuration to allow requests from your frontend.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow requests from your React app and your deployed frontend URL
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "https://your-netlify-app-name.netlify.app"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply these settings to all endpoints
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    // Build the security filter chain.
    @Bean
    public SecurityFilterChain securityFilterChain(
        HttpSecurity http,
        AuthenticationProvider authenticationProvider,
        JwtAuthenticationFilter jwtAuthFilter
    ) throws Exception {

        http
            // Enable CORS with our configuration
            .cors(withDefaults())
            // Disable CSRF protection (common for REST APIs)
            .csrf(csrf -> csrf.disable())
            // Authorization settings
            .authorizeHttpRequests(authorize -> authorize
                // Permit all OPTIONS requests used in CORS preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Permit access to auth and health endpoints
                .requestMatchers("/api/v1/auth/**", "/api/v1/health").permitAll()
                // Permit GET requests for problems (publicly accessible)
                .requestMatchers(HttpMethod.GET, "/api/v1/problems/**").permitAll()
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            // Ensure the session is stateless (as common for JWT-based auth)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Set the custom authentication provider
            .authenticationProvider(authenticationProvider)
            // Add the JWT filter before the username/password filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
