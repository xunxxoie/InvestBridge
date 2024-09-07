package com.investbridge.model.dto.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileInfoResponse {
    private String userId;
    private String userEmail;
    private String userName;
    private String phoneNumber;
    private String birth;
    private String userRole;
    
}

