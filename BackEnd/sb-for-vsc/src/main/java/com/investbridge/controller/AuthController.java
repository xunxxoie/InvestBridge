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

import com.investbridge.dto.JoinRequestDTO;
import com.investbridge.dto.JoinResponseDTO;
import com.investbridge.dto.LoginRequestDTO;
import com.investbridge.dto.LoginResponseDTO;
import com.investbridge.exception.ErrorResponse;
import com.investbridge.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "로그인/회원가입 API")
public class AuthController {
    private final AuthService authService;
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    
    @PostMapping("/login") //"POST /api/login" request controller
    @Operation(summary = "로그인", description = "사용자 이메일과 비밀번호로 로그인합니다.")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request){
        try{
            LoginResponseDTO response = authService.login(request); // Object that contains ResponseDTO after login
            logger.info("Login Successful for {}", request.getUserEmail());
            return ResponseEntity.ok(response);
        }catch(BadCredentialsException e){
            logger.info("Login Failed with Auth problem for {}", request.getUserEmail());
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Login Failed", e.getMessage()));
        }catch(Exception e){
            logger.info("Login Failed with Server Error for {}", request.getUserEmail());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unknown Error is occured", e.getMessage()));
        }
    }

    @PostMapping("/join") //"POST /api/join" request controller
    @Operation(summary = "회원가입", description = "회원가입")
    public ResponseEntity<?> join(@RequestBody JoinRequestDTO request){
        try{
            JoinResponseDTO response = authService.join(request); //
            logger.info("Join Successful for {}", request.getUserEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }catch(RuntimeException e){
            logger.info("Join Failed with duplicated Email Problem {]", request.getUserEmail());
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already exits");
        }catch(Exception e){
            logger.info("Join Failed with server Error for {}", request.getUserEmail());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Unknown Error is occured", e.getMessage()));
        }

    }
}