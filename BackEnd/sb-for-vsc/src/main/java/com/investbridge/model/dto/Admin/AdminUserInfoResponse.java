package com.investbridge.model.dto.Admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserInfoResponse {
    private String id;
    private String userId;
    private String userEmail;
    private String phoneNumber;
    private String birth;
    private String role;
    private String createdAt;
    private boolean isBlocked;
}
