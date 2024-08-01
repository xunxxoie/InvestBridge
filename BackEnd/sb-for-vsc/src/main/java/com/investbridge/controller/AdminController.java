package com.investbridge.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.dto.Http.PatchNoteRequestDTO;
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

        String adminId = jwtTokenProvider.getUserIdFromToken(token);
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
}
