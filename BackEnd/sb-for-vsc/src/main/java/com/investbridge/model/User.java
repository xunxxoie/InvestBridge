package com.investbridge.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.investbridge.model.enums.UserJob;
import com.investbridge.model.enums.UserRole;


@Document(collection = "users")
public class User {

    @Id
    private String id;

    //Property
    private String userId;
    private String userPw;
    private String userEmail;
    private String userName;

    private LocalDateTime birth;
    private String phoneNumber;
    private UserJob job;
    private UserRole userRole;

     //Constructor
     public User() {}
    
     public User(String id, String userId, String userPw, String userEmail, String userName, String phoneNumber,
             LocalDateTime birth, UserJob job, UserRole userRole) {
         this.id = id;
         this.userId = userId;
         this.userPw = userPw;
         this.userEmail = userEmail;
         this.userName = userName;
         this.phoneNumber = phoneNumber;
         this.birth = birth;
         this.job = job;
         this.userRole = userRole;
     }

    //FK
    @DBRef
    private List<Idea> ideas;

    //Getter, Setter
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public LocalDateTime getBirth() {
        return birth;
    }

    public void setBirth(LocalDateTime birth) {
        this.birth = birth;
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

    public List<Idea> getIdeas() {
        return ideas;
    }

    public void setIdeas(List<Idea> ideas) {
        this.ideas = ideas;
    }

}