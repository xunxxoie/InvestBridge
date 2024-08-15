package com.investbridge.model.dto.Object;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomInfo {
    private String userId; // 상대방 유저의 아이디
    
    private String updatedAt;
}
