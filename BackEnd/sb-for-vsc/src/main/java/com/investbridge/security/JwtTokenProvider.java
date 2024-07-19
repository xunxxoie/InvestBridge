package com.investbridge.security;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

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
    public String createToken(String userName, String userRole){
        // Set payLoad (payLode includes several claims)
        Date now = new Date();
        Claims claims = Jwts.claims()
                                .setIssuer("Invest Bridge") // Token Provider
                                .setAudience(userName) // Token Receiver
                                .setSubject(userName) 
                                .setIssuedAt(now) // Token Generated Time
                                .setExpiration(new Date(now.getTime() + validateTime)); // Expiration based on validateTime
        claims.put("userRole", userRole); // Add Customized Claims
        
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

    public String getUserNameFromToken(String token){
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