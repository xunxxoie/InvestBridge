package com.investbridge.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.dto.LoginRequestDTO;
import com.investbridge.dto.LoginResponseDTO;
import com.investbridge.exception.ErrorResponse;
import com.investbridge.service.AuthService;

@RestController
@RequestMapping("/api")
public class AuthController {
    private final AuthService authService;
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        logger.info("Received login request for email: {}", loginRequest.getUserEmail());
        try {
            LoginResponseDTO response = authService.login(loginRequest);
            logger.info("Login successful for email: {}", loginRequest.getUserEmail());
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            logger.error("Login failed for email: {}", loginRequest.getUserEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("AUTH-001", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error during login for email: {}", loginRequest.getUserEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("SYS-001", e.getMessage()));
        }
    }
}