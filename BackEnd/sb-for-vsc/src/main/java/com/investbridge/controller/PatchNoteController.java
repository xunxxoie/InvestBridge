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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.exception.ErrorResponse;
import com.investbridge.model.dto.Admin.PatchNoteRequest;
import com.investbridge.model.dto.Admin.PatchNoteResponse;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.service.PatchNoteService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/patchnote")
public class PatchNoteController {

    private static final Logger logger = LoggerFactory.getLogger(PatchNoteController.class);

    private final PatchNoteService patchNoteService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "새로운 패치노트 등록하기", description = "새로운 패치노트를 등록합니다.")
    public ResponseEntity<?> patchNoteAdd(@ModelAttribute PatchNoteRequest request, @CookieValue(name="jwt", required = false) String token){

        String adminId = jwtTokenProvider.getUserEmailFromToken(token);
        request.setAdminId(adminId);

        try{
            String response = patchNoteService.addPatchNote(request);
            logger.info("Add PatchNote Succeed {}", request.getVersion());
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Add PatchNote Failed {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Add PatchNote Failed : {} ", e.getMessage()));
        }
    }

    @GetMapping
    @Operation(summary = "모든 패치노트 불러오기", description = "데이터베이스에 저장된 모든 패치노트를 불러옵니다.")
    public ResponseEntity<?> getAllPatchNotes(@CookieValue(name = "jwt", required = false)String token) {
        try {
            List<PatchNoteResponse> response = patchNoteService.findAllPatchNotes();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Get All PatchNotes Failed {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Get All PatchNotes Failed : {}", e.getMessage()));
        }
    }

    @GetMapping("/{version}")
    @Operation(summary = "특정 패치노트 불러오기", description = "특정 패치노트를 불러옵니다.")
    public ResponseEntity<?> patchnNoteDetails(@PathVariable String version){
        try{
            PatchNoteResponse response = patchNoteService.findPatchNote(version);
            logger.info("Find PatchNote Succeed {}", response.getVersion());
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("ind PatchNote failed {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("INTERNAL SERVER ERROR : {}", e.getMessage()));
        }
    }

    @DeleteMapping("/{version}")
    @Operation(summary = "특정 패치노트 삭제하기", description = "특정 패치 노트를 삭제합니다.")
    public ResponseEntity<?> deletePatchNote(
        @PathVariable String version,
        @CookieValue(name = "jwt", required = false) String token) {
        try {
            patchNoteService.deletePatchNoteByVersion(version);
            logger.info("Patch note deleted successfully: {}", version);
            return ResponseEntity.ok("Patch note deleted successfully.");
        } catch (Exception e) {
            logger.error("Failed to delete patch note: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Failed to delete patch note: {}", e.getMessage()));
        }
    }

    @PutMapping(value = "/{version}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "특정 패치노트 수정하기", description = "특정 패치노트를 수정합니다.")
    public ResponseEntity<?> updatePatchNote(
        @PathVariable String version,
        @ModelAttribute PatchNoteRequest request,
        @CookieValue(name = "jwt", required = false) String token) {
        try {
            logger.info("Update token Success: {}", token);
            String adminId = jwtTokenProvider.getUserEmailFromToken(token);
            request.setAdminId(adminId);
            patchNoteService.updatePatchNoteByVersion(version, request);
            logger.info("Update PatchNote Success: {}", version);
            return ResponseEntity.ok("Update PatchNote Success.");
        } catch (Exception e) {
            logger.error("Update PatchNote Failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Update PatchNote Failed: {}", e.getMessage()));
        }
    }

    @GetMapping("/patchnotes-versions")
    @Operation(summary = "패치노트 버전 불러오기", description = "패치노트의 버전 목록을 불러옵니다.")
    public ResponseEntity<?> patchNoteVersionList(){
        try{
            List<String> response = patchNoteService.findAllPatchNoteVersions();
            return ResponseEntity.ok(response);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Find All PatchNote Version failed : {}", e.getMessage()));
        }
    }
}