package com.investbridge.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.exception.ErrorResponse;
import com.investbridge.model.dto.Object.UserProfileDTO;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.service.IdeaService;
import com.investbridge.service.UserService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    
    private static final Logger logger = LoggerFactory.getLogger(IdeaController.class);

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final IdeaService ideaService;

    @Autowired
    public ProfileController(UserService userService, JwtTokenProvider jwtTokenProvider, IdeaService ideaService) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.ideaService = ideaService;
    }

    @GetMapping
    @Operation(summary = "유저 프로필 요약 불러오기", description = "유저 프로필의 요약 정보를 불러옵니다.")
    public ResponseEntity<?> readProfileSummary(@CookieValue(name = "jwt", required = false)String token){
        String userId = jwtTokenProvider.getUserIdFromToken(token);
        try {
            UserProfileDTO newUserProfile = userService.getUserProfile(userId);
            if (newUserProfile == null){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }
            logger.info("Read User Profile Summary Succeed {}", newUserProfile.getUserEmail());
            return ResponseEntity.ok(newUserProfile);
        } catch(RuntimeException e){
            logger.info("Read User Profile Summary Failed {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse("Join Failed : {} ", e.getMessage()));
        } catch (Exception e) {
            logger.info("Read User Profile Summary Failed {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving user information");
        }
            
    }
}

