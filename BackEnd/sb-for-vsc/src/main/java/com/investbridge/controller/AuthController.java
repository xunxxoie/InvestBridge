package com.investbridge.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.dto.Http.LoginRequestDTO;
import com.investbridge.dto.Http.LoginResponseDTO;
import com.investbridge.dto.Http.RegisterRequestDTO;
import com.investbridge.dto.Http.RegisterResponseDTO;
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

            ResponseCookie jwtCookie = ResponseCookie.from("jwt", response.getToken())
                .httpOnly(true)
                 //.secure(true) -> // When use https
                .sameSite("Strict")
                .maxAge(24*60*60)
                .path("/")
                .build();

            logger.info("Login Succeed {} ", request.getUserEmail());

            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(response);

        }catch(BadCredentialsException e){
            logger.info("Login Failed : PASSWORD DISMATCHED {} ", request.getUserEmail());
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Login Failed : {} ", e.getMessage()));
        }catch(Exception e){
            logger.info("Login Failed : INTERNAL SERVER ERROR : {}", request.getUserEmail());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Login Failed : {}", e.getMessage()));
        }
    }

    @PostMapping("/join") //"POST /api/join" request controller
    @Operation(summary = "회원가입", description = "회원가입")
    public ResponseEntity<?> join(@RequestBody RegisterRequestDTO request){
        try{
            RegisterResponseDTO response = authService.join(request); 
            logger.info("Join Succeed {}", request.getUserEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }catch(RuntimeException e){
            logger.info("Join Failed : EMAIL ALREADY EXITS", request.getUserEmail());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse("Join Failed : {} ", e.getMessage()));
        }catch(Exception e){
            logger.info("Join Failed : INTERNAL SERVER ERROR : {}", request.getUserEmail());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Join Failed : {} ", e.getMessage()));
        }

    }
}