package com.investbridge.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.exception.ErrorResponse;
import com.investbridge.model.dto.Http.PatchNoteRequestDTO;
import com.investbridge.model.dto.Http.PatchNoteResponseDTO;
import com.investbridge.model.dto.Object.AdminUserInfoDTO;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.service.AdminService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    private final AdminService adminService;
    private final JwtTokenProvider jwtTokenProvider;
    private static final Logger logger = LoggerFactory.getLogger(IdeaController.class);
    
    public AdminController(AdminService adminService, JwtTokenProvider jwtTokenProvider) {
        this.adminService = adminService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping("/check-admin")
    @Operation(summary = "관리자 페이지 접근 유효성 검증", description = "관리자 페이지 접근 권한을 확인합니다.")
    public ResponseEntity<?> adminCheck(@CookieValue(name="jwt", required = false) String token){

        //GET UserRole for Check Admin
        String userRole = jwtTokenProvider.getUserRoleFromToken(token);
        
        if(userRole.equals("ADMIN"))
            return ResponseEntity.ok(true);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invaild Access");
    }

    @GetMapping("/patchnote/{version}")
    @Operation(summary = "특정 패치노트 불러오기", description = "특정 패치노트를 불러옵니다.")
    public ResponseEntity<?> patchnNoteDetails(@PathVariable String version){
        try{
            PatchNoteResponseDTO response = adminService.findPatchNote(version);
            logger.info("Find PatchNote Succeed {}", response.getVersion());
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("ind PatchNote failed {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("INTERNAL SERVER ERROR : {}", e.getMessage()));
        }
    }

    @PostMapping("/patchnote")
    @Operation(summary = "새로운 패치노트 등록", description = "새로운 패치노트를 등록합니다.")
    public ResponseEntity<?> patchNoteAdd(@RequestBody PatchNoteRequestDTO request, @CookieValue(name="jwt", required = false) String token){

        //GET admin's ID for register
        String adminId = jwtTokenProvider.getUserEmailFromToken(token);
        request.setAdminId(adminId); // In PatchNoteRequestDTO

        try{
            String response = adminService.addPatchNote(request);
            logger.info("Add PatchNote Succeed {}", request.getVersion());
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Add PatchNote Failed {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Add PatchNote Failed : {} ", e.getMessage()));
        }
    }

    @GetMapping("/patchnotes-versions")
    @Operation(summary = "패치노트 버전 불러오기", description = "패치노트의 버전 목록을 불러옵니다.")
    public ResponseEntity<?> patchNoteVersionList(@CookieValue(name = "jwt", required = false)String token){
        try{
            List<String> response = adminService.findAllPatchNoteVersions();
            return ResponseEntity.ok(response);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Find All PatchNote Version failed : {}", e.getMessage()));
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
}
