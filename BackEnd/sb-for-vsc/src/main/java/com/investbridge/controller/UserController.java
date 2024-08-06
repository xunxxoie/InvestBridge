package com.investbridge.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.exception.ErrorResponse;
import com.investbridge.model.dto.Object.UserProfileDTO;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.service.UserService;



@RestController
@RequestMapping("/api/user")
public class UserController {
    
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    public UserController(UserService userService, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

@GetMapping("/profile")
    public ResponseEntity<?> readprofile(@CookieValue(name = "jwt", required = false)String token){
        String userId = jwtTokenProvider.getUserIdFromToken(token);
        try {
            UserProfileDTO newUser = userService.getUserProfile(userId);
            if (newUser == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            return ResponseEntity.ok(newUser);
        } catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse("Join Failed : {} ", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving user information");
        }
            
    }
    

}

