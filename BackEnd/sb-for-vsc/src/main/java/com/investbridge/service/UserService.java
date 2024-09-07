package com.investbridge.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;


import com.investbridge.model.db.User;
import com.investbridge.model.dto.User.UserInfoResponse;
import com.investbridge.model.dto.User.UserProfileInfoResponse;
import com.investbridge.model.dto.User.UserUpdateDto;
import com.investbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private static final Logger logger = Logger.getLogger(UserService.class.getName());

    public UserProfileInfoResponse getUserProfile(String userId) {
       
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return UserProfileInfoResponse.builder()
            .userId(user.getUserId())
            .userEmail(user.getUserEmail())
            .userName(user.getUserName())
            .phoneNumber(user.getPhoneNumber())
            .birth(user.getBirth().format(DateTimeFormatter.ISO_DATE))
            .userRole(user.getUserRole().name()) 
            .build();
    }

    public UserInfoResponse getUserInfoFromUserEmail(String userEmail){
        User user = userRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid Email"));

        return UserInfoResponse.builder()
            .userId(user.getUserId())
            .userEmail(user.getUserEmail())
            .userRole(user.getUserRole().name())
            .build();
    }

    public String getRefreshToken(String userEmail){
        User user = userRepository.findByUserEmail(userEmail).orElse(null);
        return user.getRefreshToken();      
    }

    public long getTotalSubscribers() {
        return userRepository.count();
    }

    public long getNewSubscribersLast1Day() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(1);
        return userRepository.countByCreatedAtAfter(thirtyDaysAgo);
    }

    public long getSupportersCount() {
        return userRepository.countByUserRole("SUPPORTER");
    }

    public long getDreamersCount() {
        return userRepository.countByUserRole("DREAMER");
    }

    public double calculateSupporterToDreamerRatio() {
        long supporters = getSupportersCount();
        long dreamers = getDreamersCount();
        return dreamers == 0 ? 0 : (double) supporters / dreamers;
    }

    public UserProfileInfoResponse updateUserProfile(UserUpdateDto updateDto) {
        if (updateDto.getUserId() == null) {
            throw new RuntimeException("User ID is required");
        }
    
        User user = userRepository.findByUserId(updateDto.getUserId()) 
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        //update logic
        user.setUserEmail(updateDto.getUserEmail());
        user.setPhoneNumber(updateDto.getPhoneNumber());
        
        
        User savedUser = userRepository.save(user);
        
        return convertToUserProfileInfoResponse(savedUser);
    }

private UserProfileInfoResponse convertToUserProfileInfoResponse(User user) {
    return UserProfileInfoResponse.builder()
        .userId(user.getUserId())
        .userEmail(user.getUserEmail())
        .phoneNumber(user.getPhoneNumber())
        .build();
}

}