package com.investbridge.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.exception.ErrorResponse;
import com.investbridge.model.dto.Http.PatchNoteRequestDTO;
import com.investbridge.model.dto.Http.PatchNoteResponseDTO;
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
    
    private final AdminService adminService;
    private final IdeaService ideaService; 
    private final JwtTokenProvider jwtTokenProvider;

    private static final Logger logger = LoggerFactory.getLogger(IdeaController.class);
    
    public AdminController(AdminService adminService, IdeaService ideaService, JwtTokenProvider jwtTokenProvider) {
        this.adminService = adminService;
        this.ideaService = ideaService;
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

    @PostMapping(value = "/patchnote", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "새로운 패치노트 등록", description = "새로운 패치노트를 등록합니다.")
    public ResponseEntity<?> patchNoteAdd(@ModelAttribute PatchNoteRequestDTO request, @CookieValue(name="jwt", required = false) String token){

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
    public ResponseEntity<?> patchNoteVersionList(){
        try{
            List<String> response = adminService.findAllPatchNoteVersions();
            return ResponseEntity.ok(response);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Find All PatchNote Version failed : {}", e.getMessage()));
        }
    }

    @GetMapping("/users/{userId}/idea-summary")
    @Operation(summary = "특정 유저 아이디어 요약 불러오기", description = "특정 유저의 아이디어 요약을 불러옵니다.")
    public ResponseEntity<?> UserIdeaSummary(@PathVariable String userId){
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

    @DeleteMapping("/ideas/{id}")
    @Operation(summary = "특정 아이디어 삭제", description = "특정 아이디어를 삭제합니다.")
    public ResponseEntity<Void> deleteIdea(@PathVariable String id){
        ideaService.deleteIdea(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users/{role}")
    @Operation(summary = "특정 역할을 가진 유저의 정보 불러오기", description = "특정 역할을 가진 유저의 정보를 불러옵니다.")
    public ResponseEntity<?> getUserListByRole(@PathVariable String role){
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

     @GetMapping("/patchnotes")
    @Operation(summary = "모든 패치노트 불러오기", description = "데이터베이스에 저장된 모든 패치노트를 불러옵니다.")
    public ResponseEntity<?> getAllPatchNotes(@CookieValue(name = "jwt", required = false)String token) {
        try {
            List<PatchNoteResponseDTO> response = adminService.findAllPatchNotes();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Get All PatchNotes Failed {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Get All PatchNotes Failed : {}", e.getMessage()));
        }
    }

    // 추가
    @PutMapping(value = "/patchnote/{version}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "패치 노트 수정하기", description = "기존의 패치 노트를 수정합니다.")
    public ResponseEntity<?> updatePatchNote(
        @PathVariable String version,
        @ModelAttribute PatchNoteRequestDTO request,
        @CookieValue(name = "jwt", required = false) String token) {
        try {
            logger.info("Update token Success: {}", token);
            String adminId = jwtTokenProvider.getUserEmailFromToken(token);
            request.setAdminId(adminId);
            adminService.updatePatchNoteByVersion(version, request);
            logger.info("Update PatchNote Success: {}", version);
            return ResponseEntity.ok("Update PatchNote Success.");
        } catch (Exception e) {
            logger.error("Update PatchNote Failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Update PatchNote Failed: {}", e.getMessage()));
        }
    }

    // 추가
    @DeleteMapping("/patchnote/{version}")
    @Operation(summary = "패치 노트 삭제하기", description = "특정 패치 노트를 삭제합니다.")
    public ResponseEntity<?> deletePatchNote(
        @PathVariable String version,
        @CookieValue(name = "jwt", required = false) String token) {
        try {
            adminService.deletePatchNoteByVersion(version);
            logger.info("Patch note deleted successfully: {}", version);
            return ResponseEntity.ok("Patch note deleted successfully.");
        } catch (Exception e) {
            logger.error("Failed to delete patch note: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Failed to delete patch note: {}", e.getMessage()));
        }
    }
}