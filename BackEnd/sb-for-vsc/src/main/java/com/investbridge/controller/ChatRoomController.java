package com.investbridge.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.investbridge.exception.ErrorResponse;
import com.investbridge.model.db.ChatRoom;
import com.investbridge.model.db.Message;
import com.investbridge.model.dto.Chat.ChatRoomListResponse;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.service.ChatService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatroom")
@Tag(name = "ChatRoom", description = "채팅룸 API")
public class ChatRoomController {

    private static final Logger logger = LoggerFactory.getLogger(ChatRoomController.class);
    
    private final ChatService chatService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/list")
    @Operation(summary = "채팅룸 목록 가져오기", description = "유저가 참여하고 있는 채팅룸 목록을 가져옵니다.")
    public ResponseEntity<?> getChatRoomList(@CookieValue(name="jwt", required = false) String token) {
        try{
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            List<ChatRoomListResponse> response = chatService.getChatRoomList(userId);
            
            logger.info("Get ChatRoom List Succeed");
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Get ChatRoom List Failed : {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred {} ", e.getMessage()));
        }
    }

    @PostMapping("/{dreamerId}")
    @Operation(summary = "채팅룸 생성+입장", description = "채팅룸이 생성되고 입장합니다.")
    public ResponseEntity<?> createAndEnterChatRoom(@PathVariable String dreamerId,@CookieValue(name="jwt", required = false) String token ) {
        try{
            String supporterId = jwtTokenProvider.getUserIdFromToken(token);

            if(dreamerId == null || supporterId == null) throw new NoResourceFoundException(HttpMethod.POST, dreamerId);
        
            ChatRoom response = chatService.getChatRoom(supporterId, dreamerId);

            logger.info("Get ChatRoom Succeed");
            return ResponseEntity.ok(response);
        }catch(NoResourceFoundException e){
            logger.error("Get ChatRoom Failed : {}", e.getMessage());
            return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse("There is missing parameter in request {} ", e.getMessage()));
        }catch(Exception e){
            logger.error("Get ChatRoom Failed : {}", e.getMessage());
            return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse("Unexpected Error Occurred {} ", e.getMessage()));
        }
    }
   
    @GetMapping("/{chatRoomId}/messages")
    @Operation(summary = "채팅방의 채팅 메시지 가져오기", description = "채팅방의 채팅 메시지를 가져옵니다.")
    public ResponseEntity<?> getChatMessages(@PathVariable String chatRoomId, @CookieValue(name="jwt", required = false) String token) {
        try{
            List<Message> response = chatService.getChatMessages(chatRoomId);
            logger.info("Get ChatRoom Messages Succeed");

            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Get ChatRoom Messages Failed : {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred {} ", e.getMessage()));
        }
    }
    
    @PostMapping("/{chatRoomId}/{action}")
    @Operation(summary = "수락 대기중인 채팅룸의 수락/거절 여부 결정", description = "채팅룸 요청의 수락/거절 여부를 결정합니다.")
    public ResponseEntity<?> setChatRoomStatus(@PathVariable String chatRoomId, @PathVariable String action){
        try{
            boolean response = chatService.setRoomStatus(chatRoomId, action);

            logger.info("Set ChatRoom Status Succeed with {} : {}", chatRoomId, action);
            return ResponseEntity.ok(response);
        }catch(Exception e){
            logger.error("Set ChatRoom Status Failed : {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred {}", e.getMessage()));
        }
    }
}
