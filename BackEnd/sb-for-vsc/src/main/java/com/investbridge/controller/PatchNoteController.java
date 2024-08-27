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
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/patchnote")
@RequiredArgsConstructor
@Tag(name = "PatchNote", description = "패치노트 API")
public class PatchNoteController {
    //TODO 관리자 권한 부여하기 
    private static final Logger logger = LoggerFactory.getLogger(PatchNoteController.class);

    private final PatchNoteService patchNoteService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "새로운 패치노트 등록하기", description = "새로운 패치노트를 등록합니다.")
    public ResponseEntity<?> patchNoteAdd(@ModelAttribute PatchNoteRequest request, @CookieValue(name="jwt", required = false) String token){
        try{
            String adminId = jwtTokenProvider.getUserIdFromToken(token);
            request.setAdminId(adminId);

            String response = patchNoteService.addPatchNote(request);

            logger.info("Create PatchNote Succeed! Version: {}", request.getVersion());
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Create PatchNote Failed : {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred : {}", e.getMessage()));
        }
    }

    @GetMapping
    @Operation(summary = "모든 패치노트 불러오기", description = "모든 패치노트를 불러옵니다.")
    public ResponseEntity<?> getAllPatchNotes(@CookieValue(name = "jwt", required = false)String token) {
        try {
            List<PatchNoteResponse> response = patchNoteService.findAllPatchNotes();

            logger.info("Get {} PatchNotes Succeed", response.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Get All PatchNotes Failed : {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred : {}", e.getMessage()));
        }
    }

    @GetMapping("/{version}")
    @Operation(summary = "특정 패치노트 불러오기", description = "특정 패치노트를 불러옵니다.")
    public ResponseEntity<?> patchnNoteDetails(@PathVariable String version){
        try{
            PatchNoteResponse response = patchNoteService.findPatchNote(version);

            logger.info("Get Patchnote Succeed! Version: {}", response.getVersion());
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Get Patchnote Failed : {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred : {}", e.getMessage()));
        }
    }

    @DeleteMapping("/{version}")
    @Operation(summary = "특정 패치노트 삭제하기", description = "특정 패치 노트를 삭제합니다.")
    public ResponseEntity<?> deletePatchNote(@PathVariable String version, @CookieValue(name = "jwt", required = false) String token) {
        try {
            patchNoteService.deletePatchNoteByVersion(version);
            logger.info("Delete Patchnote Succeed! Version: {}", version);
            return ResponseEntity.ok(true);
        } catch (Exception e) {
            logger.error("Delete Patchnote Failed : {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred : {}", e.getMessage()));
        }
    }

    @PutMapping(value = "/{version}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "특정 패치노트 수정하기", description = "특정 패치노트를 수정합니다.")
    public ResponseEntity<?> updatePatchNote(@PathVariable String version, @ModelAttribute PatchNoteRequest request,
                                                            @CookieValue(name = "jwt", required = false) String token) {
        try {
            String adminId = jwtTokenProvider.getUserIdFromToken(token);
            request.setAdminId(adminId);

            patchNoteService.updatePatchNoteByVersion(version, request);

            logger.info("Update PatchNote Succeed! Version: {}", version);
            return ResponseEntity.ok(true);
        } catch (Exception e) {
            logger.error("Update PatchNote Failed : {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred : {}", e.getMessage()));
        }
    }

    @GetMapping("/versions")
    @Operation(summary = "패치노트 버전 불러오기", description = "패치노트의 버전 목록을 불러옵니다.")
    public ResponseEntity<?> patchNoteVersionList(){
        try{
            List<String> response = patchNoteService.findAllPatchNoteVersions();
            logger.info("Get {} Patchnote versions Succeed", response.size());
            return ResponseEntity.ok(response);
        } catch(Exception e){
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred : {}", e.getMessage()));
        }
    }
}