package com.investbridge.model.dto.Chat;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomListResponse {
    private String chatRoomId;
    private String dreamerId;
    private String supporterId;
    

    private String latestMessage;
    private LocalDateTime latestMessageTime;
    
    private String chatRoomStatus;
}
