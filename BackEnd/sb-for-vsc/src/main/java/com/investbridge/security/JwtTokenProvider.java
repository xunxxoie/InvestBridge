package com.investbridge.security;

import java.security.Key;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.investbridge.model.dto.User.UserInfoResponse;
import com.investbridge.security.filter.LogoutFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {

    private static final long ACCESS_TOKEN_VALIDITY = 60 * 60 * 1000;
    private static final long REFRESH_TOKEN_VALIDITY = 7 * 24 * 60 * 60 * 1000;

    private static final Logger logger = LoggerFactory.getLogger(LogoutFilter.class);

    private final Key key; // JWT - Verify Signature

    // @Value Annotation is able to use value in 'application.properties'
    public JwtTokenProvider(@Value("${jwt.secret}")String secret, @Value("${jwt.expiration}")long validateTime) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    //Access Token create method
    public String generateAccessToken(String userId, String userEmail, String userName, String phoneNumber, String userRole){
        // Set payLoad (payLode includes several claims)
        Date now = new Date();
        Claims claims = Jwts.claims()
                                .setAudience("Invest Bridge")
                                .setIssuer("Invest Bridge") // Token Provider
                                .setSubject(userEmail)
                                .setIssuedAt(now) // Token Generated Time
                                .setExpiration(new Date(now.getTime() + ACCESS_TOKEN_VALIDITY)); // Expiration based on validateTime
        
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

    //Refresh Token create method
    public String generateRefreshToken(String userEmail){
        return Jwts.builder()
                    .setSubject(userEmail)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis()+REFRESH_TOKEN_VALIDITY))
                    .signWith(key,SignatureAlgorithm.HS256)
                    .compact();
    }
    
    // Validate Token Method
    public boolean validateAccessToken(String token) throws ExpiredJwtException {
        try{
            Jwts.parserBuilder() // Start Parser Builder
                .setSigningKey(key) // Set key to use to varify token's sign
                .build() // Make parser(based on our settings)
                .parseClaimsJws(token); // Parsing token And varify '형식, 서명, 만료기간'
            return true;
        }catch(ExpiredJwtException e){
            throw e;
        }catch(Exception e){
            logger.error("Unexpected error is occured : {}", e.getMessage());
            return false;
        }
    }

    public boolean validateRefreshToken(String token) throws ExpiredJwtException {
        try{
            Jwts.parserBuilder() // Start Parser Builder
                .setSigningKey(key) // Set key to use to varify token's sign
                .build() // Make parser(based on our settings)
                .parseClaimsJws(token); // Parsing token And varify '형식, 서명, 만료기간'
            return true;
        }catch(ExpiredJwtException e){
            throw e;
        }catch(Exception e){
            logger.error("Unexpected error is occured : {}", e.getMessage());
            return false;
        }
    }

    //Get User by token
    public UserInfoResponse getUserbyToken(String token){
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();

        return new UserInfoResponse(
            claims.get("userId", String.class),
            claims.getSubject(), // Email
            claims.get("userName", String.class),
            claims.get("phoneNumber", String.class),
            claims.get("userRole", String.class)
        );
    }

    public String getUserEmailFromExpiredToken(String token){
        try {
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
            return claims.getSubject();
        } catch (ExpiredJwtException e) {
            return e.getClaims().getSubject();
        }
    }
    
    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        
        return claims.get("userId", String.class);
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

    public Date getEpirationDateFromToken(String token){
        return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getExpiration();
    }
}