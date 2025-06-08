package com.syntexa.api.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtService {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private int jwtExpirationMs;

    // Extracts the username (the subject claim) from the token.
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extracts a specific claim by applying the provided resolver function.
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Generates a token without any extra claims.
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    // Generates a token, including any extra claims provided.
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS256, getSignInKey())
                .compact();
    }

    // Validates the token by comparing the token's subject (username) 
    // with the provided user details and ensuring the token is not expired.
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // Checks if the token has expired.
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extracts the expiration date from the token's claims.
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Uses the legacy JJWT parser API to extract all claims from the token.
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSignInKey())
                .parseClaimsJws(token)
                .getBody();
    }

    // Decodes the Base64-encoded secret and returns the signing key.
    private Key getSignInKey() {
        byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
        return new SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.getJcaName());
    }
}
