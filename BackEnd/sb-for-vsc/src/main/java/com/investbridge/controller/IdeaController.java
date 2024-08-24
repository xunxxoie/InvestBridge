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
import com.investbridge.model.dto.Http.IdeaRequestDTO;
import com.investbridge.model.dto.Http.IdeaResponseDTO;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.service.IdeaService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/ideas")
public class IdeaController {

    private final IdeaService ideaService;
    private final JwtTokenProvider jwtTokenProvider;
    private static final Logger logger = LoggerFactory.getLogger(IdeaController.class);

    public IdeaController(IdeaService ideaService, JwtTokenProvider jwtTokenProvider) {
        this.ideaService = ideaService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    //Annotation states that Get request only multipart-form-data-value
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "아이디어 생성", description = "새로운 아이디어를 생성합니다.")
    public ResponseEntity<?> ideaAdd(@ModelAttribute IdeaRequestDTO request, @CookieValue(name="jwt", required = false) String token){

        String userName = jwtTokenProvider.getUserbyToken(token).getUserName();
        request.setUserName(userName);

        try{
            IdeaResponseDTO response = ideaService.addIdea(request);
            logger.info("Create Idea Succeed {}", request.getTitle());
            return ResponseEntity.ok(response);
        }catch(RuntimeException e){
            logger.error("Create Idea Failed : FILE ERROR : {} ", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(new ErrorResponse("File Upload Failed : {} ", e.getMessage()));
        }catch(Exception e){
            logger.error("Create Idea Failed :  INTERNAL SERVER ERROR : {} ", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Create Idea Failed : {} " , e.getMessage()));
        }
    }

    
    @GetMapping
    @Operation(summary = "전체 아이디어 불러오기", description = "전체 아이디어를 불러옵니다.")
    public ResponseEntity<?> ideaList(@CookieValue(name="jwt", required = false)String token){
        try{
            List<Idea> response = ideaService.findAllIdea();
            logger.info("Load All Idea Succeed");
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Load All Ideas Failed : INTERNAL SERVER ERROR : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Load All Idea Failed : {} ", e.getMessage() ));
        }
    }

    @GetMapping("/detail/{id}")
    @Operation(summary = "특정 아이디어 불러오기", description = "특정 아이디어를 불러옵니다.")
    public ResponseEntity<?> ideaDetails(@PathVariable String id) {
        try{
            Idea response = ideaService.findIdea(id);
            logger.info("Load Idea Succeed : {} ", response.getId());
            return ResponseEntity.ok(response);
        }catch (Exception e){
            logger.error("Load All Ideas Failed : INTERNAL SERVER ERROR : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Load Idea Failed : {} ", e.getMessage() ));
        }
    }
    
    @PostMapping("/{id}/like")
    @Operation(summary = "좋아요 수 업데이트", description = "좋아요 수를 업데이트 합니다.")
    public ResponseEntity<?> updateLikes (@CookieValue(name="jwt", required = false)String token, @PathVariable String id){
        String userId = jwtTokenProvider.getUserIdFromToken(token);
        try{
            Idea response = ideaService.updateLikes(id, userId);
            logger.info("Update Like Succeed");
            return ResponseEntity.ok(response);
        }catch (Exception e){
            logger.error("Update Like Failed : {} ", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Update Like Failed : {}", e.getMessage()));
        }
    }

    @PostMapping("/{id}/favorite")
    @Operation(summary = "스크랩 수 업데이트", description = "스크랩 수를 업데이트 합니다.")
    public ResponseEntity<?> updateFavorites(@CookieValue(name="jwt", required = false)String token, @PathVariable String id){
        String userId = jwtTokenProvider.getUserIdFromToken(token);
        try{
            Idea response = ideaService.updateFavorites(id, userId);
            logger.info("Update Favorite Succeed");
            return ResponseEntity.ok(response);
        }catch (Exception e){
            logger.error("Update Favorite Failed : {} ", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Update Favorite Failed : {}", e.getMessage()));
        }
    }

    // 추가
    @GetMapping("/top-viewed")
    @Operation(summary = "이번 주 최고 조회수 아이디어 불러오기", description = "이번 주 최고 조회수 아이디어를 불러옵니다.")
    public ResponseEntity<?> topViewedIdea(){
        try{
            Idea response = ideaService.findTopViewedIdea();
            logger.info("Find Top Viewed Idea Succeed");
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Find Top Viewed Idea Failed : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Find Top Viewed Idea Failed : {}", e.getMessage()));
        }
    }
    
    // 추가
    @PostMapping("/{id}/view")
    @Operation(summary = "조회수 업데이트", description = "아이디어의 조회수를 업데이트 합니다.")
    public ResponseEntity<?> updateViewCount(@PathVariable String id) {
        try {
            Idea response = ideaService.incrementViewCount(id);
            logger.info("Update View Count Succeed for Idea ID: {}", id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Update View Count Failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Update View Count Failed: {}", e.getMessage()));
        }
    }
}
