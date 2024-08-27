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
import com.investbridge.model.dto.User.UserProfileInfoResponse;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "Profile", description = "프로필 API")
public class ProfileController {
    
    private static final Logger logger = LoggerFactory.getLogger(ProfileController.class);

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping
    @Operation(summary = "유저 프로필 요약 불러오기", description = "유저 프로필의 요약 정보를 불러옵니다.")
    public ResponseEntity<?> readProfileSummary(@CookieValue(name = "jwt", required = false)String token){
        //TODO 에러 처리 로직 보완
        try {
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            UserProfileInfoResponse newUserProfile = userService.getUserProfile(userId);

            //TODO 여기서 ResponseEntity 반환하지 말고, 에러를 던지고 아래서 받아서 던지는 구조로 구성
            if (newUserProfile == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

            logger.info("Get User Profile Succeed", newUserProfile.getUserId());
            return ResponseEntity.ok(newUserProfile);
        } catch(RuntimeException e){
            logger.info("Get User Profile Failed(reason why?)", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("Get User Profile Failed(reason why?)", e.getMessage()));
        } catch (Exception e) {
            logger.info("Read User Profile Summary Failed {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred : {}", e.getMessage()));
        }
    }
}

