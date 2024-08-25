package com.investbridge.service;

import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.investbridge.model.db.User;
import com.investbridge.model.dto.Object.UserDTO;
import com.investbridge.model.dto.Object.UserProfileDTO;
import com.investbridge.repository.IdeaRepository;
import com.investbridge.repository.UserRepository;


@Service
@Transactional
public class UserService {
    private final IdeaRepository ideaRepository;
    private final UserRepository userRepository;
    
    public UserService(IdeaRepository ideaRepository, UserRepository userRepository) {
        this.ideaRepository = ideaRepository;
        this.userRepository = userRepository;
    }

    public UserProfileDTO getUserProfile(String userId) {
       
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return UserProfileDTO.builder()
            .userId(user.getUserId())
            .userEmail(user.getUserEmail())
            .userName(user.getUserName())
            .phoneNumber(user.getPhoneNumber())
            .birth(user.getBirth().format(DateTimeFormatter.ISO_DATE))
            .userRole(user.getUserRole().name()) 
            .userInterest("interest")
            .build();
    }

    public UserDTO getUserInfoFromUserEmail(String userEmail){
        User user = userRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid Email"));

        return UserDTO.builder()
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