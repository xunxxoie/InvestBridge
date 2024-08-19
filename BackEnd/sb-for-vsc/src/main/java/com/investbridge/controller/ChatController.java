package com.investbridge.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.model.db.Message;
import com.investbridge.service.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ChatController {
    
    private final ChatService chatService;

    @MessageMapping("/chat.sendMessage/{roomId}")
    @SendTo("/topic/chatroom.{roomId}")
    public Message sendMessage(@DestinationVariable String roomId, @Payload Message message){
        return chatService.saveAndSendMessage(roomId, message);
    }

    /**
     * headerAccessor와 getSessionAttributes
     * 웹소켓으로 주고받는 메시지의 헤더(메타데이터 -> userId, roomId 등)에 접근하기 위한 클래스. 
     * getSessionAttribute는 웹소켓 세션과 연관된 속성을 담고 있는 Map<>을 반환
     * 따라서 이 세션을 통해서 사용자가 현재 어떤 채팅방에 속해있는지를 확인할 수 있음!
     */
    @MessageMapping("/chat.enterRoom/{roomId}")
    @SendTo("/topic/chatroom.{roomId}")
    public Message enterRoom(@DestinationVariable String roomId, @Payload Message message, SimpMessageHeaderAccessor headerAccessor){

        String investorId = message.getSenderId();
        String dreamerId = message.getRecipientId();
        Message resultMessage = chatService.enterChatRoom(investorId, dreamerId, message);

        headerAccessor.getSessionAttributes().put("roomId", roomId);
        headerAccessor.getSessionAttributes().put("userId", message.getSenderId());

        return resultMessage;
    }

    @MessageMapping("/chat.leaveRoom/{roomId}")
    @SendTo("/topic/chatroom.{roomId}")
    public Message leaveRoom(@DestinationVariable String roomId, @Payload Message message){
        return chatService.leaveChatRoom(roomId, message);
    }
}
