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

import com.investbridge.dto.Http.PatchNoteRequestDTO;
import com.investbridge.dto.Http.PatchNoteResponseDTO;
import com.investbridge.dto.Object.AdminUserInfoDTO;
import com.investbridge.exception.ErrorResponse;
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

    @PostMapping("/patchnote")
    @Operation(summary = "패치노트 등록", description = "새로운 패치노트를 등록합니다.")
    public ResponseEntity<?> createPatchNote(@RequestBody PatchNoteRequestDTO request, @CookieValue(name="jwt", required = false) String token){
        
        //Validate "is Admin?""
        String userRole = jwtTokenProvider.getUserRoleFromToken(token).toString();

        if(token == null || !userRole.equals("ADMIN") ){
            logger.error("There is no Authority to Create PatchNote");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authority is needed");
        }

        String adminId = jwtTokenProvider.getUserEmailFromToken(token);
        request.setAdminId(adminId);

        try{
            String response = adminService.createPatchNote(request);
            logger.info("Create patchNote Succeed {}", request.getTitle());
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Create patchNote Failed {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Create PatchNote Failed : {} ", e.getMessage()));
        }
    }

    @GetMapping("/patchnote/{version}")
    @Operation(summary = "특정 패치노트 가져오기", description = "선택된 패치노트를 가져옵니다.")
    public ResponseEntity<?> getPatchnotes(@PathVariable String version){
        try{
            PatchNoteResponseDTO response = adminService.getPatchnote(version);
            logger.info("Get patchnote Succeed {}", response.getVersion());
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Get patchnote failed {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("INTERNAL SERVER ERROR : {}", e.getMessage()));
        }
    }
    
    @GetMapping("/patchnotes-versions")
    @Operation(summary = "패치노트 버전 목록 가져오기", description = "패치노트 버전 목록을 가져옵니다.")
    public ResponseEntity<?> getPatchNoteVersions(@CookieValue(name = "jwt", required = false)String token){
        try{
            List<String> response = adminService.getAllVersions();
            logger.info("Get All Versions Succeed");
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Get All Versions Failed {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Get All Versions failed : {}", e.getMessage()));
        }
    }

    @GetMapping("/users")
    @Operation(summary = "전체 유저 정보 불러오기", description = "전체 유저 정보를 불러옵니다.")
    public ResponseEntity<?> getUsersInfo(){
        try{
            List<AdminUserInfoDTO> response = adminService.getUsersInfo();
            logger.info("Get All User Info Succeed");
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Get All User Info Failed {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Get User Info failed : {}", e.getMessage()));
        }
    }
}
