package com.investbridge.model.dto.Object;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserInfoDTO {
    private String id;
    private String userId;
    private String userEmail;
    private String phoneNumber;
    private String birth;
    private String role;
    private String createdAt;
}
