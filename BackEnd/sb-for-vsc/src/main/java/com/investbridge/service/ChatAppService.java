package com.investbridge.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.investbridge.model.db.ChatRooms;
import com.investbridge.model.dto.Object.ChatRoomInfo;
import com.investbridge.repository.ChatRoomRepository;

@Service
@Transactional
public class ChatAppService {
    private final ChatRoomRepository chatRoomRepository;

    public ChatAppService(ChatRoomRepository chatRoomRepository) {
        this.chatRoomRepository = chatRoomRepository;
    }
    
    public List<ChatRoomInfo> findAllChatRoomListByUserId(String userId){
        List<ChatRooms> chatRoomList = chatRoomRepository.findByMe(userId)
                                                            .orElse(null);

        if(chatRoomList == null)
            return null;

        return chatRoomList.stream()
            .map(info -> ChatRoomInfo.builder()
                    .userId(info.getYou())
                    .build())
            .collect(Collectors.toList());
    }
}
