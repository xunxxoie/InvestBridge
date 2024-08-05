package com.investbridge.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.model.dto.Object.UserDTO;
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

    //Return User Info
    @GetMapping
    public ResponseEntity<?> readUserObj(@CookieValue(name = "jwt", required = false)String token){
        if(token == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("There is no token");
        
        UserDTO newUser = jwtTokenProvider.getUserbyToken(token);

        return ResponseEntity.ok(newUser);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> readprofile(@CookieValue(name = "jwt", required = false)String token){
        if(token == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("There is no token");
        try {
            UserDTO newUser = jwtTokenProvider.getUserbyToken(token);
            if (newUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving user information");
        }
            
    }

    // @GetMapping("/profile")
    // public ResponseEntity<?> readUser(@CookieValue(name = "jwt", required = false)String token){
    //     if(token == null)
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("There is no token");
        
    //     UserDTO profileDTO = jwtTokenProvider.getUserbyToken(token);

    //     return ResponseEntity.ok(profileDTO);
    // }


    // @GetMapping("/profile")
    // public ResponseEntity<UserDTO> getUserProfile(@CookieValue(name = "jwt", required = false) String token) {
    //     if (token == null) {
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    //     }

    //     if (!jwtTokenProvider.validateToken(token)) {
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    //     }

    //     String userId = jwtTokenProvider.getUserbyToken(token);
    //     if (userId == null) {
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    //     }

    //     UserDTO profileDTO = userService.getUserProfile(userId);
    //     return ResponseEntity.ok(UserDTO);
    // }


}

