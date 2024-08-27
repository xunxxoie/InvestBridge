package com.investbridge.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.exception.ErrorResponse;
import com.investbridge.model.dto.User.UserInfoResponse;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/id")
    private ResponseEntity<?> getUserId(@CookieValue(name="jwt", required = false) String token) {
        //TODO 로직 구성 다시
        try {
            String userEmail = jwtTokenProvider.getUserEmailFromToken(token);
            UserInfoResponse userInfo = userService.getUserInfoFromUserEmail(userEmail);

            logger.info("Get UserId Succeed! userId: {}",userInfo.getUserEmail());
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            logger.error("Get userId Failed : {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred : {}", e.getMessage()));
        }
    }
}