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
@Document(collection =  "messages")
public class Messages {
    @Id
    private String id;

    private String chatRoomId;

    private String senderId;
    private String content;

    @CreatedDate
    private LocalDateTime sentAt;

    private boolean isRead;
}
