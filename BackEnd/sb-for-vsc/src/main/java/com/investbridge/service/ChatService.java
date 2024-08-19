package com.investbridge.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.investbridge.model.db.ChatRoom;
import com.investbridge.model.db.Message;
import com.investbridge.model.dto.Object.ChatRoomListDTO;
import com.investbridge.repository.ChatRoomRepository;
import com.investbridge.repository.MessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {
    
    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;

    public Message saveAndSendMessage(String roomId, Message message){
        message.setRoomId(roomId);
        message.setTimestamp(LocalDateTime.now());
        return messageRepository.save(message);
    }

    public Message enterChatRoom(String investorId, String dreamerId, Message message){
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

    public ChatRoom getChatRoom(String investorId, String dreamerId){
        return chatRoomRepository.findByInvestorIdAndDreamerId(investorId, dreamerId).orElseGet(() -> {
            ChatRoom newChatRoom = ChatRoom.builder()
                    .investorId(investorId)
                    .dreamerId(dreamerId)
                    .status(ChatRoom.ChatRoomStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .build();

            return chatRoomRepository.save(newChatRoom);         
        });
    }

    public List<ChatRoomListDTO> getChatRoomList(String userId){
        List<ChatRoom> chatRooms = chatRoomRepository.findByInvestorIdOrDreamerId(userId, userId);

        return chatRooms.stream().map(chatRoom -> {
            ChatRoomListDTO dto = new ChatRoomListDTO();

            dto.setChatRoomId(chatRoom.getId());
            dto.setPartnerId(chatRoom.getInvestorId().equals(userId) ? chatRoom.getDreamerId() : chatRoom.getInvestorId());
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

}
