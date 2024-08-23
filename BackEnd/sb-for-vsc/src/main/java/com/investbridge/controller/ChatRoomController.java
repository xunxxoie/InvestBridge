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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.exception.ErrorResponse;
import com.investbridge.model.db.ChatRoom;
import com.investbridge.model.db.Message;
import com.investbridge.model.dto.Object.ChatRoomListDTO;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.service.ChatService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatroom")
public class ChatRoomController {
    
    private final ChatService chatService;
    private final JwtTokenProvider jwtTokenProvider;

    private static final Logger logger = LoggerFactory.getLogger(ChatRoomController.class);

    @GetMapping("/list")
    @Operation(summary = "채팅룸 목록 가져오기", description = "유저가 참여하고 있는 채팅룸 목록을 가져옵니다.")
    public ResponseEntity<?> getChatRoomList(@CookieValue(name="jwt", required = false) String token) {
        try{
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            List<ChatRoomListDTO> chatRooms = chatService.getChatRoomList(userId);
            logger.info("Get chat room list successfully");

            return ResponseEntity.ok(chatRooms);
        }catch(Exception e){
            logger.error("Unexpected Error occurred in ChatRoomController!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse("Unexpected Error is occured in ChatRoomController! {} ", e.getMessage()));
        }
    }

    @GetMapping("/messages/{chatRoomId}")
    @Operation(summary = "채팅방의 채팅 메시지 가져오기", description = "채팅방의 채팅 메시지를 가져옵니다.")
    public ResponseEntity<?> getChatMessages(@PathVariable String chatRoomId, @CookieValue(name="jwt", required = false) String token) {
        try{
            List<Message> response = chatService.getChatMessages(chatRoomId);
            logger.info("Get chat messages successfully");

            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Unexpected Error occurred in ChatRoomController!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse("Unexpected Error is occured in ChatRoomController! {} ", e.getMessage()));
        }
    }

    @PostMapping("/{dreamerId}")    
    @Operation(summary = "채팅방을 생성합니다.", description = "새로운 채팅방을 생성합니다.")
    public ResponseEntity<?> createChatRoom(@CookieValue(name="jwt", required = false) String token, @PathVariable String dreamerId){
        try{
            String supporterId = jwtTokenProvider.getUserIdFromToken(token);
            ChatRoom chatRoom = chatService.getChatRoom(supporterId,dreamerId);
            return ResponseEntity.ok(chatRoom);
        }catch(Exception e){
            logger.error("Unexpected Error occurred in ChatRoomController!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse("Unexpected Error occurred in ChatRoomController! {} ", e.getMessage()));
        }
    }
    



    @PostMapping("/{chatRoomId}/{action}")
    @Operation(summary = "수락 대기중인 채팅룸의 수락/거절 여부 결정", description = "채팅룸 요청의 수락/거절 여부를 결정합니다.")
    public ResponseEntity<?> setChatRoomStatus(@PathVariable String chatRoomId, @PathVariable String action){
        try{
            boolean response = chatService.setRoomStatus(chatRoomId, action);
            logger.info("Set chat room status successfully");

            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Unexpected Error occurred in ChatRoomController!");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Internal Server Error {}", e.getMessage()));
        }
    }
}
