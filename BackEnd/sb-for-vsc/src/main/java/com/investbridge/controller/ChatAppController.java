package com.investbridge.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.exception.ErrorResponse;
import com.investbridge.model.dto.Object.ChatRoomInfo;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.service.ChatAppService;

import io.swagger.v3.oas.annotations.Operation;


@RestController
@RequestMapping("/api/chat")
public class ChatAppController {
    
    private static final Logger logger = LoggerFactory.getLogger(ChatAppController.class);

    private final JwtTokenProvider jwtTokenProvider;
    private final ChatAppService chatAppService;


    public ChatAppController(JwtTokenProvider jwtTokenProvider, ChatAppService chatAppService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.chatAppService = chatAppService;
    }

    @GetMapping("/room/list")
    @Operation(summary = "유저 채팅방 목록 불러오기", description = "현재 접속한 유저가 포함되어있는 채팅방 목록을 불러옵니다.")
    public ResponseEntity<?> readUserChatRoomList(@CookieValue(name = "jwt", required = false)String token){
        String userId = jwtTokenProvider.getUserIdFromToken(token);
        try{
            List<ChatRoomInfo> response = chatAppService.findAllChatRoomListByUserId(userId);
            logger.info("Find All User's ChatRoom Succeed");
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.info("Find All User's ChatRoom Failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Internal Server error", e.getMessage()));
        }

    }
}