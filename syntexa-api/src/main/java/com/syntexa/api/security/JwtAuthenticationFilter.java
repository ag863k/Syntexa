package com.syntexa.api.security;

import com.syntexa.api.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    public JwtAuthenticationFilter(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // ## DEBUGGING START ##
        System.out.println("\n====== [JWT FILTER] - Request Received for URL: " + request.getRequestURI() + " ======");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("[JWT FILTER] - No JWT Token found in Header. Passing to next filter.");
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        System.out.println("[JWT FILTER] - Token Found.");

        try {
            username = jwtService.extractUsername(jwt);
            System.out.println("[JWT FILTER] - Username extracted from token: " + username);
        } catch (Exception e) {
            System.out.println("[JWT FILTER] - ERROR! Could not extract username. Reason: " + e.getMessage());
            filterChain.doFilter(request, response); // Let security chain handle the error
            return;
        }


        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            System.out.println("[JWT FILTER] - User is not yet authenticated. Loading user details from UserService...");
            UserDetails userDetails = this.userService.loadUserByUsername(username);

            if (jwtService.isTokenValid(jwt, userDetails)) {
                System.out.println("[JWT FILTER] - TOKEN IS VALID. Authenticating user...");
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("[JWT FILTER] - User successfully authenticated and set in Security Context.");
            } else {
                System.out.println("[JWT FILTER] - ERROR! Token is INVALID.");
            }
        } else {
            System.out.println("[JWT FILTER] - Username is null OR user is already authenticated.");
        }

        filterChain.doFilter(request, response);
        System.out.println("====== [JWT FILTER] - Filter chain continued. ======");
        // ## DEBUGGING END ##
    }
}