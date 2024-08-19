package com.investbridge.model.dto.Object;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomListDTO {
    private String chatRoomId;
    private String partnerId;

    private String latestMessage;
    private LocalDateTime latestMessageTime;
    
    private String chatRoomStatus;
}
