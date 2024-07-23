package com.investbridge.security;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.investbridge.dto.Object.UserDTO;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {

    private final Key key; // JWT - Verify Signature
    private final long validateTime; // JWT - Expiration Time

    // @Value Annotation is able to use value in 'application.properties'
    public JwtTokenProvider(@Value("${jwt.secret}")String secret, @Value("${jwt.expiration}")long validateTime) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.validateTime = validateTime;
    }

    //Jwt Token create method
    public String createToken(String userId, String userEmail, String userName, String phoneNumber, String userRole){
        // Set payLoad (payLode includes several claims)
        Date now = new Date();
        Claims claims = Jwts.claims()
                                .setAudience("Invest Bridge")
                                .setIssuer("Invest Bridge") // Token Provider
                                .setSubject(userEmail)
                                .setIssuedAt(now) // Token Generated Time
                                .setExpiration(new Date(now.getTime() + validateTime)); // Expiration based on validateTime

        // Add Customized Claims
        claims.put("userId", userId);
        claims.put("userName", userName);
        claims.put("phoneNumber", phoneNumber);
        claims.put("userRole", userRole);
        
        return Jwts.builder() // Set Header
                    .setClaims(claims) // Set PayLoad
                    .signWith(key, SignatureAlgorithm.HS256) // Set Sign
                    .compact();
    }

    // Validate Token Method
    public boolean validateToken(String token){
        try{
            Jwts.parserBuilder() // Start Parser Builder
                .setSigningKey(key) // Set key to use to varify token's sign
                .build() // Make parser(based on our settings)
                .parseClaimsJws(token); // Parsing token And varify '형식, 서명, 만료기간'
            return true;
        }catch(Exception e){
            return false;
        }
    }

    //Get User by token
    public UserDTO getUserbyToken(String token){
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();

        return new UserDTO(
            claims.get("userId", String.class),
            claims.getSubject(),
            claims.get("userName", String.class),
            claims.get("phoneNumber", String.class)
        );
    }

    public String getUserEmailFromToken(String token){
        return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody() // Get Claims
                    .getSubject(); // Get Subject from Claims!
    }

    public String getUserRoleFromToken(String token){
        return Jwts.parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token)
        .getBody()
        .get("userRole", String.class);
    }
}