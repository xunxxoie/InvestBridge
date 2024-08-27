package com.investbridge.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.exception.ErrorResponse;
import com.investbridge.model.dto.Admin.AdminIdeaInfoResponse;
import com.investbridge.model.dto.Admin.AdminUserInfoResponse;
import com.investbridge.model.dto.Idea.IdeaSummaryResponse;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.service.AdminService;
import com.investbridge.service.IdeaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "관리자 권한 API")
public class AdminController {
    
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    
    private final AdminService adminService;
    private final IdeaService ideaService; 
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/check-admin")
    @Operation(summary = "관리자 페이지 접근 유효성 검증", description = "관리자 페이지 접근 권한을 확인합니다.")
    public ResponseEntity<?> adminCheck(@CookieValue(name="jwt", required = false) String token){
        try{
            String userRole = jwtTokenProvider.getUserRoleFromToken(token);
            boolean isAdmin = userRole.equals("ADMIN");

            if(isAdmin){
                logger.info("Check isAdmin Succeed - True");
                return ResponseEntity.ok(true);
            }else{
                logger.info("Check isAdmin Succeed - False");
                return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Access Admin Page is  just for ADMIN");
            }

        }catch(Exception e){
            logger.error("Check isAdmin Failed : {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected error occurred", e.getMessage()));
        }
    }

    // NOTE AdminPage - User 
    @GetMapping("/users/{userId}/idea-summary")
    @Operation(summary = "특정 유저 아이디어 요약 불러오기", description = "특정 유저의 아이디어 요약을 불러옵니다.")
    public ResponseEntity<?> UserIdeaSummary(@PathVariable String userId){
        try{
            List<IdeaSummaryResponse> response = adminService.findUserIdea(userId);

            logger.info("Get Idea Summary List Succeed");
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Get Idea Summary List Failed : {} ", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected error occurred", e.getMessage()));
        }
    }

    @GetMapping("/users")
    @Operation(summary = "전체 유저 정보 불러오기", description = "전체 유저의 정보를 불러옵니다.")
    public ResponseEntity<?> UserInfosList(){
        try{
            List<AdminUserInfoResponse> response = adminService.findAllUserInfo();
            logger.info("Find All Users Info Succeed");
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Find All Users Info Failed {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected error occurred", e.getMessage()));
        }
    }

    @GetMapping("/users/{role}") 
    @Operation(summary = "특정 역할을 가진 유저의 정보 불러오기", description = "특정 역할을 가진 유저의 정보를 불러옵니다.")
    public ResponseEntity<?> getUserListByRole(@PathVariable("role") String role){
        try{
            List<AdminUserInfoResponse> response = adminService.findUsersByRole(role);

            logger.info("Find User Sorted by UserRole Succeed");
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Find User Sorted by UserRole Failed {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected error occurred", e.getMessage()));
        }
    }

    // NOTE AdminPage - Idea
    @GetMapping("/ideas")
    @Operation(summary = "전체 아이디어 불러오기", description = "전체 아이디어를 불러옵니다.")
    public ResponseEntity<?> IdeaInfoList(){
        try{
            List<AdminIdeaInfoResponse> response = adminService.findAllIdeaInfo();
            logger.info("Find All User Infos Succeed");
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Find All Idea Infos Failed {} ", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected error occurred", e.getMessage()));
        }
    }

    @DeleteMapping("/ideas/{id}")
    @Operation(summary = "특정 아이디어 삭제", description = "특정 아이디어를 삭제합니다.")
    public ResponseEntity<?> deleteIdea(@PathVariable String id){
        try{
            boolean response = ideaService.deleteIdea(id);
            
            logger.info("Delete Idea Succeed");
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Delete Idea Failed {} ", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected error occurred", e.getMessage()));
        }
    }

    @PutMapping("/ideas/block/{id}")
    @Operation(summary = "아이디어 정지/해제", description = "아이디어를 정지/해제합니다.")
    public ResponseEntity<?> blockUnblockIdea(@PathVariable String id, @RequestBody boolean isBlocked){
        try{
            boolean response = ideaService.updateIdeaBlockStatus(id, isBlocked);
            logger.info("Block/Unblock Idea Succeed {} -> {}", !response, response);
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Idea BlockStatus Failed : {}", e.getMessage());
            return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse("Unexpected error occurred", e.getMessage()));
        }
    }
}