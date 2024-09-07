package com.investbridge.model.db;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;


import com.investbridge.model.enums.UserJob;
import com.investbridge.model.enums.UserRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String userId;
    private String userPw;
    private String userEmail;
    private String userName;
    private LocalDateTime birth;
    private String phoneNumber;
    private UserJob job;
    private UserRole userRole;

    @CreatedDate
    private LocalDateTime createdAt;

    @DBRef
    private List<Idea> ideas;

    private String refreshToken;

    private boolean isBlocked;
}