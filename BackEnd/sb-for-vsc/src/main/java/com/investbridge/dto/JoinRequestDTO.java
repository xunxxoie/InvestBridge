package com.investbridge.dto;

import java.time.LocalDateTime;

import com.investbridge.model.enums.Interest;
import com.investbridge.model.enums.UserJob;
import com.investbridge.model.enums.UserRole;

public class JoinRequestDTO {
    private String userId;
    private String userPw;
    private String userEmail;
    private String userName;

    private LocalDateTime birth;
    private String phoneNumber;
    private Interest userInterest;
    private UserJob job;
    private UserRole userRole;

    public JoinRequestDTO() {}
    
    public JoinRequestDTO(String userId, String userPw, String userEmail, String userName, LocalDateTime birth,
            String phoneNumber, Interest userInterest, UserJob job, UserRole userRole) {
        this.userId = userId;
        this.userPw = userPw;
        this.userEmail = userEmail;
        this.userName = userName;
        this.birth = birth;
        this.phoneNumber = phoneNumber;
        this.userInterest = userInterest;
        this.job = job;
        this.userRole = userRole;
    }

    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public String getUserPw() {
        return userPw;
    }
    public void setUserPw(String userPw) {
        this.userPw = userPw;
    }
    public String getUserEmail() {
        return userEmail;
    }
    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public LocalDateTime getBirth() {
        return birth;
    }
    public void setBirth(LocalDateTime birth) {
        this.birth = birth;
    }
    public String getPhoneNumber() {
        return phoneNumber;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    public Interest getUserInterest() {
        return userInterest;
    }
    public void setUserInterest(Interest userInterest) {
        this.userInterest = userInterest;
    }
    public UserJob getJob() {
        return job;
    }
    public void setJob(UserJob job) {
        this.job = job;
    }
    public UserRole getUserRole() {
        return userRole;
    }
    public void setUserRole(UserRole userRole) {
        this.userRole = userRole;
    }
}

