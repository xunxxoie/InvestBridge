package com.investbridge.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.dto.Object.UserDTO;
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
}

