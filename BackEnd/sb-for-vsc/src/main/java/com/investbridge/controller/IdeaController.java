package com.investbridge.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.exception.ErrorResponse;
import com.investbridge.model.db.Idea;
import com.investbridge.model.dto.Idea.IdeaCreateRequest;
import com.investbridge.model.dto.Idea.IdeaCreateResponse;
import com.investbridge.model.dto.Idea.IdeaDetailResponse;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.service.IdeaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ideas")
@Tag(name = "Idea", description = "아이디어 API")
public class IdeaController {

    private static final Logger logger = LoggerFactory.getLogger(IdeaController.class);

    private final IdeaService ideaService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping
    @Operation(summary = "전체 아이디어 불러오기", description = "전체 아이디어를 불러옵니다.")
    public ResponseEntity<?> ideaList(@CookieValue(name="jwt", required = false)String token){
        try{
            List<Idea> response = ideaService.findAllIdea();

            logger.info("Load {} Ideas Succeed", response.size());
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Load Ideas Failed : {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred : {}", e.getMessage()));
        }
    }

    //TODO 아이디어 생성 예외처리 로직 보완하기
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "아이디어 생성하기", description = "새로운 아이디어를 생성합니다.")
    public ResponseEntity<?> ideaAdd(@ModelAttribute IdeaCreateRequest request, @CookieValue(name="jwt", required = false) String token){
        try{
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            request.setUserId(userId);

            IdeaCreateResponse response = ideaService.addIdea(request);

            logger.info("Create Idea Succeed! Title: {}, Author: {}", response.getTitle(), response.getUserId());
            return ResponseEntity.ok(response);
        }catch(RuntimeException e){
            logger.error("Create Idea Failed(File upload Error) : {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                .body(new ErrorResponse("File Upload Failed : {} ", e.getMessage()));
        }catch(Exception e){
            logger.error("Create Idea Failed(Unexpected Error) {} ", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred : {}", e.getMessage()));
        }
    }

    @GetMapping("/detail/{id}")
    @Operation(summary = "특정 아이디어 불러오기", description = "특정 아이디어를 불러옵니다.")
    public ResponseEntity<?> ideaDetails(@PathVariable("id") String id, @CookieValue(name="jwt", required = false)String token) {
        try{
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            IdeaDetailResponse response = ideaService.incrementAndReturnViewCount(userId, id);
            
            logger.info("Get Idea Succeed! IdeaId: {}", response.getIdeaId());
            return ResponseEntity.ok(response);
        }catch (Exception e){
            logger.error("GET Idea Failed : {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred : {}", e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/like")
    @Operation(summary = "좋아요 수 업데이트", description = "좋아요 수를 업데이트 합니다.")
    public ResponseEntity<?> updateLikes (@CookieValue(name="jwt", required = false)String token, @PathVariable String id){
        try{
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            Idea response = ideaService.updateLikes(id, userId);

            logger.info("Update Like Succeed! Updated Likes: {}", response.getLikes());
            return ResponseEntity.ok(response);
        }catch (Exception e){
            logger.error("Update Like Failed : {} ", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred : {}", e.getMessage()));
        }
    }

    @PostMapping("/{id}/favorite")
    @Operation(summary = "즐겨찾기 수 업데이트", description = "즐겨찾기 수를 업데이트 합니다.")
    public ResponseEntity<?> updateFavorites(@CookieValue(name="jwt", required = false)String token, @PathVariable String id){
        try{
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            Idea response = ideaService.updateFavorites(id, userId);
            
            logger.info("Update favorites Succeed! Updated favorites: {}", response.getFavorites());
            return ResponseEntity.ok(response);
        }catch (Exception e){
            logger.error("Update Favorite Failed : {} ", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred : {}", e.getMessage()));
        }
    }
}