package com.investbridge.model.dto.Auth;

import java.time.LocalDateTime;

import com.investbridge.model.enums.Interest;
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
public class RegisterRequest {
    private String userId;
    private String userPw;
    private String userEmail;
    private String userName;

    private LocalDateTime birth;
    private String phoneNumber;
    private Interest userInterest;
    private UserJob job;
    private UserRole userRole;
}

