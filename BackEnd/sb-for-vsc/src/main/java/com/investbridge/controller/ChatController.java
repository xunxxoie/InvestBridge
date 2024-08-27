package com.investbridge.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.model.db.Message;
import com.investbridge.service.ChatService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@Tag(name = "Chat", description = "채팅 API")
public class ChatController {
    
    private final ChatService chatService;

    @MessageMapping("/chat.sendMessage/{chatRoomId}")
    @SendTo("/topic/chatroom.{chatRoomId}")
    public Message sendMessage(@DestinationVariable String chatRoomId, @Payload Message message){
        return chatService.saveAndSendMessage(chatRoomId, message);
    }

    /**
     * headerAccessor와 getSessionAttributes
     * 웹소켓으로 주고받는 메시지의 헤더(메타데이터 -> userId, roomId 등)에 접근하기 위한 클래스. 
     * getSessionAttribute는 웹소켓 세션과 연관된 속성을 담고 있는 Map<>을 반환
     * 따라서 이 세션을 통해서 사용자가 현재 어떤 채팅방에 속해있는지를 확인할 수 있음!
     */
    @MessageMapping("/chat.enterRoom/{chatRoomId}")
    @SendTo("/topic/chatroom.{chatRoomId}")
    public Message enterRoom(@DestinationVariable String chatRoomId, @Payload Message message, SimpMessageHeaderAccessor headerAccessor){

        String senderId = message.getSenderId();
        String partnerId = message.getRecipientId();
        Message resultMessage = chatService.enterChatRoom(senderId, partnerId, message);

        headerAccessor.getSessionAttributes().put("roomId", chatRoomId);
        headerAccessor.getSessionAttributes().put("userId", senderId);

        return resultMessage;
    }

    @MessageMapping("/chat.leaveRoom/{chatRoomId}")
    @SendTo("/topic/chatroom.{chatRoomId}")
    public Message leaveRoom(@DestinationVariable String chatRoomId, @Payload Message message){
        return chatService.leaveChatRoom(chatRoomId, message);
    }
}
