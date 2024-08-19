package com.investbridge.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.model.dto.Object.ChatRoomListDTO;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.service.ChatService;

import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatRoomController {
    
    private final ChatService chatService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomListDTO>> getChatRoomList(@CookieValue(name="jwt", required = false) String token) {
        String userId = jwtTokenProvider.getUserIdFromToken(token);
        List<ChatRoomListDTO> chatRooms = chatService.getChatRoomList(userId);
        return ResponseEntity.ok(chatRooms);
    }
    
}
