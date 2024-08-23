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
import com.investbridge.model.dto.Object.AdminIdeaInfoDTO;
import com.investbridge.model.dto.Object.AdminUserInfoDTO;
import com.investbridge.model.dto.Object.IdeaSummaryDTO;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.service.AdminService;
import com.investbridge.service.IdeaService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    
    private final AdminService adminService;
    private final IdeaService ideaService; 
    private final JwtTokenProvider jwtTokenProvider;
    
    public AdminController(AdminService adminService, IdeaService ideaService, JwtTokenProvider jwtTokenProvider) {
        this.adminService = adminService;
        this.ideaService = ideaService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping("/check-admin")
    @Operation(summary = "관리자 페이지 접근 유효성 검증", description = "관리자 페이지 접근 권한을 확인합니다.")
    public ResponseEntity<?> adminCheck(@CookieValue(name="jwt", required = false) String token){

        String userRole = jwtTokenProvider.getUserRoleFromToken(token);
        
        if(userRole.equals("ADMIN"))
            return ResponseEntity.ok(true);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invaild Access");
    }

    @GetMapping("/users/{role}")
    @Operation(summary = "특정 역할을 가진 유저의 정보 불러오기", description = "특정 역할을 가진 유저의 정보를 불러옵니다.")
    public ResponseEntity<?> getUserListByRole(@PathVariable("role") String role){
        try{
            List<AdminUserInfoDTO> response = adminService.findUsersByRole(role);
            logger.info("Find User Infos By userRole Succeed");
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Find User Infos By userRole Failed {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Find User Infos By userRole Failed : {}",e.getMessage()));
        }
    }

    @GetMapping("/users")
    @Operation(summary = "전체 유저 정보 불러오기", description = "전체 유저의 정보를 불러옵니다.")
    public ResponseEntity<?> UserInfosList(){
        try{
            List<AdminUserInfoDTO> response = adminService.findAllUserInfo();
            logger.info("Find All User Infos Succeed");
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Find All User Infos Failed {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Find All User Infos failed : {}", e.getMessage()));
        }
    }

    @GetMapping("/users/{userId}/idea-summary")
    @Operation(summary = "특정 유저 아이디어 요약 불러오기", description = "특정 유저의 아이디어 요약을 불러옵니다.")
    public ResponseEntity<?> UserIdeaSummary(@PathVariable("userId") String userId){
        try{
            List<IdeaSummaryDTO> response = adminService.findUserIdea(userId);
            logger.info("Find All User Infos Succeed");
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Internal Server Error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Internal Server Error", e.getMessage()));
        }
    }

    @GetMapping("/ideas")
    @Operation(summary = "전체 아이디어 불러오기", description = "전체 아이디어를 불러옵니다.")
    public ResponseEntity<?> IdeaInfoList(){
        try{
            List<AdminIdeaInfoDTO> response = adminService.findAllIdeaInfo();
            logger.info("Find All User Infos Succeed");
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Find All Idea Infos Failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Find All Idea Infos failed : {} ", e.getMessage()));
        }
    }

    @PutMapping("/ideas/block/{id}")
    @Operation(summary = "아이디어 정지/해제", description = "아이디어를 정지/해제합니다.")
    public ResponseEntity<?> blockUnblockIdea(@PathVariable String id, @RequestBody boolean isBlocked){
        try{
            boolean response = ideaService.updateIdeaBlockStatus(id, isBlocked);
            logger.info("Idea BlockStatus Update is Succeed with {}", response);
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.info("Idea BlockStatus Failed with Unexpected Error : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Internal Server Error", e.getMessage()));
        }
    }

    @DeleteMapping("/ideas/{id}")
    @Operation(summary = "특정 아이디어 삭제", description = "특정 아이디어를 삭제합니다.")
    public ResponseEntity<Void> deleteIdea(@PathVariable String id){
        ideaService.deleteIdea(id);
        return ResponseEntity.noContent().build();
    }
}