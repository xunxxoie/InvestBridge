package com.investbridge.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.investbridge.model.db.User;
import com.investbridge.model.dto.User.UserInfoResponse;
import com.investbridge.model.dto.User.UserProfileInfoResponse;
import com.investbridge.repository.UserRepository;

import lombok.AllArgsConstructor;


@Service
@Transactional
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;

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
            .userInterest("interest")
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

    // 밑으로 쭉 추가
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
}