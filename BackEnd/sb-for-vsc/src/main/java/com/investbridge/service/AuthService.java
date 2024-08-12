package com.investbridge.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.investbridge.controller.AuthController;
import com.investbridge.model.db.User;
import com.investbridge.model.dto.Http.LoginRequestDTO;
import com.investbridge.model.dto.Http.LoginResponseDTO;
import com.investbridge.model.dto.Http.RegisterRequestDTO;
import com.investbridge.model.dto.Http.RegisterResponseDTO;
import com.investbridge.repository.UserRepository;
import com.investbridge.security.JwtTokenProvider;
import com.investbridge.security.TokenBlacklist;

@Service
@Transactional
public class AuthService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final TokenBlacklist tokenBlacklist;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    public AuthService(UserRepository userRepository, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder, TokenBlacklist tokenBlacklist) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.tokenBlacklist = tokenBlacklist;
    }

    // Login Service Logic
    public LoginResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByUserEmail(request.getUserEmail()) // Find the user whose email address matches.
                .orElseThrow(() -> new BadCredentialsException("Invalid Email")); // Throws error when find user fail.

        if(user.isBlocked() == true){
            throw new AccessDeniedException("Blocked User");
        }

        if (!passwordEncoder.matches(request.getUserPw(), user.getUserPw())) {
            throw new BadCredentialsException("Invalid Password");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getUserId(), user.getUserEmail(), user.getUserName(), user.getPhoneNumber(), user.getUserRole().toString()); // Create token based on user info
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUserId());

        userRepository.saveRefreshToken(user.getId(), refreshToken);

        return new LoginResponseDTO(accessToken, user.getUserRole().name()); // Return responsedto(token, userRole)
    }

    // Join Service Logic
    public RegisterResponseDTO join(RegisterRequestDTO request){
        
        //if Email already exits
        if(userRepository.findByUserEmail(request.getUserEmail()).isPresent())
            throw new RuntimeException("Already Exits Email");

        // Encode input PassWord
        String encodedUserPw = passwordEncoder.encode(request.getUserPw());

        User newUser = User.builder()
            .userId(request.getUserId())
            .userPw(encodedUserPw)
            .userEmail(request.getUserEmail())
            .userName(request.getUserName())
            .birth(request.getBirth())
            .phoneNumber(request.getPhoneNumber())
            .job(request.getJob())
            .userRole(request.getUserRole())
            .isBlocked(false)
            .build();
        
        User savedUser = userRepository.save(newUser);

        return new RegisterResponseDTO(savedUser.getId());
    }

    public boolean updateUserBlockStatus(String userId, boolean isBlocked){
        return userRepository.findByUserId(userId)
            .map(user -> {
                user.setBlocked(isBlocked);
                userRepository.save(user);
                return user.isBlocked();
            })
            .orElse(true);
    }
}