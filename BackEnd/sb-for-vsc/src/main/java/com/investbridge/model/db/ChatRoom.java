package com.investbridge.model.db;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chatRooms")
public class ChatRoom {
    
    @Id
    private String id;
    private String investorId;
    private String dreamerId;

    private ChatRoomStatus status;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime lastActivityAt;

    public enum ChatRoomStatus{
        PENDING, ACTIVE, CLOSED
    }
}
