package com.investbridge.model.db;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "messages")
public class Message {
    @Id
    private String id;
    private String roomId;

    private String senderId;
    private String recipientId;
    private String content;

    @CreatedDate
    private LocalDateTime timestamp;
    private MessageType type;

    public enum MessageType{
        CHAT, JOIN, LEAVE
    }
}
