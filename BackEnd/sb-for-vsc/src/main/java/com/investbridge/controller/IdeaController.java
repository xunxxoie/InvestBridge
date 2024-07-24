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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.dto.Http.IdeaRequestDTO;
import com.investbridge.dto.Http.IdeaResponseDTO;
import com.investbridge.model.Idea;
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
    @Operation(summary = "아이디어 등록", description = "아이디어를 등록합니다.")
    public ResponseEntity<?> createIdea(@ModelAttribute IdeaRequestDTO request, @CookieValue(name="jwt", required = false) String token){
        
        if(token == null){
            logger.error("There is no token for authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login is needed");
        }

        String userName = jwtTokenProvider.getUserbyToken(token).getUserName();
        request.setUserName(userName);

        try{
            IdeaResponseDTO response = ideaService.createIdea(request);
            logger.info("createIdea Successful for {}", request.getTitle());
            return ResponseEntity.ok(response);
        }catch(RuntimeException e){
            logger.error("File upload Failed {} ", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body("File Upload Failed");
        }catch(Exception e){
            logger.error("Unexpected Error Occur {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected Error");
        }
    }


    //Get All Ideas
    @GetMapping
    @Operation(summary = "아이디어 전체 불러오기", description = "전체 아이디어를 불러옵니다.")
    public ResponseEntity<?> getAllIdea(@CookieValue(name="jwt", required = false)String token){
        if(token == null){
            logger.error("There is no token for authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login is needed");
        }

        try{
            List<Idea> response = ideaService.getAllIdeas();
            logger.info("Get All idea from db is complete");
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Unexpected Error Occur {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected Error Occur");
        }
    }

    //Get idea
    @GetMapping("/{id}")
    @Operation(summary = "특정 아이디어 불러오기", description = "특정 아이디어를 불러옵니다.")
    public ResponseEntity<?> getIdea(@CookieValue(name="jwt", required = false)String token, @RequestParam("id") String id) {
        if(token == null){
            logger.error("There is no token for authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login is needed");
        }

        try{
            Idea response = ideaService.getIdea(id);
            logger.info("Get idea from db is complete");
            return ResponseEntity.ok(response);
        }catch (Exception e){
            logger.error("Unexpected Error Occur {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected Error Occur");
        }
    }
    

}
