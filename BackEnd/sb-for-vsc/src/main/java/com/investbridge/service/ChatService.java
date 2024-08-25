package com.investbridge.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.investbridge.model.db.ChatRoom;
import com.investbridge.model.db.Message;
import com.investbridge.model.dto.Chat.ChatRoomListResponse;
import com.investbridge.repository.ChatRoomRepository;
import com.investbridge.repository.MessageRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
    
    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;

    public Message saveAndSendMessage(String roomId, Message message){
        message.setRoomId(roomId);
        message.setTimestamp(LocalDateTime.now());
        return messageRepository.save(message);
    }

    public Message enterChatRoom(String investorId, String dreamerId, Message message){
        logger.info("enterChatRoom Logic Start at ChatService");
        ChatRoom chatRoom = getChatRoom(investorId, dreamerId);

        boolean isInvestor = message.getSenderId().equals(investorId);

        if(chatRoom.getStatus() == ChatRoom.ChatRoomStatus.PENDING && !isInvestor){
            chatRoom.setStatus(ChatRoom.ChatRoomStatus.ACTIVE);
            chatRoomRepository.save(chatRoom);
        }

        message.setRoomId(chatRoom.getId());
        message.setRecipientId(isInvestor ? dreamerId : investorId);
        message.setType(Message.MessageType.JOIN);
        message.setTimestamp(LocalDateTime.now());
        message.setContent(message.getSenderId() + "님이 입장하셨습니다. ");

        return saveAndSendMessage(chatRoom.getId(), message);
    }
    
    public Message leaveChatRoom(String roomId, Message message){
        message.setType(Message.MessageType.LEAVE);
        message.setContent(message.getSenderId() + "님이 퇴장하셨습니다. ");
        return saveAndSendMessage(roomId, message);
    }

    public ChatRoom getChatRoom(String supporterId, String dreamerId){
        return chatRoomRepository.findBySupporterIdAndDreamerId(supporterId, dreamerId).orElseGet(() -> {
            ChatRoom newChatRoom = ChatRoom.builder()
                    .supporterId(supporterId)
                    .dreamerId(dreamerId)
                    .status(ChatRoom.ChatRoomStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .build();

            return chatRoomRepository.save(newChatRoom);         
        });
    }

    public List<ChatRoomListResponse> getChatRoomList(String userId){
        List<ChatRoom> chatRooms = chatRoomRepository.findBySupporterIdOrDreamerId(userId, userId);

        return chatRooms.stream().map(chatRoom -> {
            ChatRoomListResponse dto = new ChatRoomListResponse();

            dto.setChatRoomId(chatRoom.getId());
            dto.setSupporterId(chatRoom.getSupporterId());
            dto.setDreamerId(chatRoom.getDreamerId());
            
            dto.setChatRoomStatus(chatRoom.getStatus().toString());

            Message latestMessage = messageRepository.findTopByRoomIdOrderByTimestampDesc(chatRoom.getId());
            if(latestMessage != null){
                dto.setLatestMessage(latestMessage.getContent());
                dto.setLatestMessageTime(latestMessage.getTimestamp());
            }else{
                dto.setLatestMessage("No Message");
                dto.setLatestMessageTime(chatRoom.getCreatedAt());
            }

            return dto;
        }).collect(Collectors.toList());
    }

    public boolean setRoomStatus(String chatRoomId, String action){
        try{
            ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);
            ChatRoom.ChatRoomStatus status = "accept".equals(action) ? ChatRoom.ChatRoomStatus.ACTIVE : ChatRoom.ChatRoomStatus.CLOSED;
            
            chatRoom.setStatus(status);
            chatRoomRepository.save(chatRoom);

            return true;
        }catch(Exception e){
            return false;
        }
    }

    public List<Message> getChatMessages(String chatRoomId){
        return messageRepository.findByRoomIdOrderByTimestampAsc(chatRoomId);
    }
}
