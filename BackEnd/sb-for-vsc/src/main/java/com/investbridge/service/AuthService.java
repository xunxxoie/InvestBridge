package com.investbridge.service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.investbridge.model.db.User;
import com.investbridge.model.dto.Auth.LoginRequest;
import com.investbridge.model.dto.Auth.LoginResponse;
import com.investbridge.model.dto.Auth.RegisterRequest;
import com.investbridge.model.dto.Auth.RegisterResponse;
import com.investbridge.repository.UserRepository;
import com.investbridge.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    // Login Service Logic
    public LoginResponse login(LoginRequest request) {
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

        return new LoginResponse(accessToken, user.getUserRole().name()); // Return responsedto(token, userRole)
    }

    // Join Service Logic
    public RegisterResponse join(RegisterRequest request){
        
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

        return new RegisterResponse(savedUser.getId());
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