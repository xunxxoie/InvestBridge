package com.investbridge.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.investbridge.dto.Object.UserDTO;
import com.investbridge.model.User;

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

    public UserDTO getUserProfile(String userId) {
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return UserDTO.builder()
            .userName(user.getUserName())
            .userEmail(user.getUserEmail())
            // .birth(user.getBirth())
            .phoneNumber(user.getPhoneNumber())
            // .userInterest(user.getUserInterest())
            .build();
    }
}