package com.investbridge.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.exception.ErrorResponse;
import com.investbridge.model.dto.Http.PatchNoteResponseDTO;
import com.investbridge.service.AdminService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/about")
public class AboutController {

    private static final Logger logger = LoggerFactory.getLogger(IdeaController.class);

    private final AdminService adminService;

    public AboutController(AdminService adminService) {
        this.adminService = adminService;
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
}
