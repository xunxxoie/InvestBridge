package com.investbridge.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.exception.ErrorResponse;
import com.investbridge.model.dto.Auth.LoginRequest;
import com.investbridge.model.dto.Auth.LoginResponse;
import com.investbridge.model.dto.Auth.RegisterRequest;
import com.investbridge.model.dto.Auth.RegisterResponse;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
@Tag(name = "Auth", description = "로그인/회원가입 API")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;
    
    @GetMapping("/is-user")
    @Operation(summary = "페이지 이동간 유효성 검증", description = "페이지로의 접근의 유효성을 검증합니다.")
    public ResponseEntity<?> checkUser(@CookieValue(name="jwt", required = false) String token){
        try{
            Boolean isUser = jwtTokenProvider.validateAccessToken(token);
            logger.info("User validation completed : {}", isUser);
            return ResponseEntity.ok(isUser);
        }catch(Exception e){
            logger.info("User validation Failed : False");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("User validation Failed : {} ", e.getMessage()));
        }
    }

    @PutMapping("/block/{userId}")
    @Operation(summary = "유저 계정 정지/해제", description = "유저의 계정을 정지/해제합니다.")
    public ResponseEntity<?> blockUnblockUser(@PathVariable String userId, @RequestBody boolean isBlocked){
        try{
            boolean response = authService.updateUserBlockStatus(userId, isBlocked);
            logger.info("User BlockStatus Update is Succeed with {}", response);
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.info("User BlockStatus Failed with Unexpected Error : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Internal Server Error", e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인을 시도합니다.")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        try{
            LoginResponse response = authService.login(request); // Object that contains ResponseDTO after login

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
            logger.info("Login Failed : PASSWORD DISMATCHED");
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Login Failed : {} ", e.getMessage()));
        }catch(AccessDeniedException e){
            logger.info("Login Failed : Blocked User");
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse("Login Failed : {}", e.getMessage()));
        }catch(Exception e){
            logger.info("Login Failed : INTERNAL SERVER ERROR : {}", request.getUserEmail());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Login Failed : {}", e.getMessage()));
        }
            
    }

    @PostMapping("/join")
    @Operation(summary = "회원가입", description = "회원가입")
    public ResponseEntity<?> join(@RequestBody RegisterRequest request){
        try{
            RegisterResponse response = authService.join(request); 
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