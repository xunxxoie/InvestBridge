package com.investbridge.controller;

import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.exception.ErrorResponse;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.service.UserService;



@RestController
@RequestMapping("/api/user")
public class UserController {
    
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    public UserController(UserService userService, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping("/id")
    private ResponseEntity<?> getUserId(@CookieValue(name="jwt", required = false) String token) {
        try {
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            return ResponseEntity.ok(Collections.singletonMap("userId", userId));
        } catch (Exception e) {
            logger.error("Get userId Failed with Unexpected Error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new ErrorResponse("Get userId Failed", e.getMessage()));
        }
    }

}