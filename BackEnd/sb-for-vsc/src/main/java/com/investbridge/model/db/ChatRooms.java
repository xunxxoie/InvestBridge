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
@Document(collection = "chatRooms")
public class ChatRooms {
    @Id
    private String id;
    
    private String me;
    private String you;

    @CreatedDate
    private LocalDateTime createdAt;
}
