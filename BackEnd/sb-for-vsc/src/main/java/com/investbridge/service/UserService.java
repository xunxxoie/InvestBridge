package com.investbridge.service;

import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.investbridge.model.db.User;
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
}