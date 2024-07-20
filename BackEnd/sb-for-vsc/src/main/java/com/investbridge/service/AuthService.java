package com.investbridge.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.investbridge.dto.JoinRequestDTO;
import com.investbridge.dto.JoinResponseDTO;
import com.investbridge.dto.LoginRequestDTO;
import com.investbridge.dto.LoginResponseDTO;
import com.investbridge.model.User;
import com.investbridge.repository.UserRepository;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.security.SecurityConfig;

@Service
@Transactional
public class AuthService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final SecurityConfig securityConfig;

    public AuthService(UserRepository userRepository, JwtTokenProvider jwtTokenProvider, SecurityConfig securityConfig) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.securityConfig = securityConfig;
    }

    // Login Service Logic
    public LoginResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByUserEmail(request.getUserEmail()) // Find the user whose email address matches.
                .orElseThrow(() -> new BadCredentialsException("Invalid Email")); // Throws error when find user fail.

        if (!securityConfig.passwordEncoder().matches(request.getUserPw(), user.getUserPw())) {
            throw new BadCredentialsException("Invalid Password");
        }

        String token = jwtTokenProvider.createToken(user.getUserEmail(), user.getUserRole().name()); // Create token based on userEmail, userRole
        return new LoginResponseDTO(token, user.getUserRole().name()); // Return responsedto(token, userRole)
    }

    // Join Service Logic
    public JoinResponseDTO join(JoinRequestDTO request){
        
        if(userRepository.findByUserEmail(request.getUserEmail()).isPresent())
            throw new RuntimeException("Already Used Email!!");

        String encodedUserPw = securityConfig.passwordEncoder().encode(request.getUserPw());

        User newUser = User.builder()
            .userId(request.getUserId())
            .userPw(encodedUserPw)
            .userEmail(request.getUserEmail())
            .userName(request.getUserName())
            .birth(request.getBirth())
            .phoneNumber(request.getPhoneNumber())
            .job(request.getJob())
            .userRole(request.getUserRole())
            .build();
        
        User savedUser = userRepository.save(newUser);

        return new JoinResponseDTO(savedUser.getId());
    }
}
