package com.investbridge.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}