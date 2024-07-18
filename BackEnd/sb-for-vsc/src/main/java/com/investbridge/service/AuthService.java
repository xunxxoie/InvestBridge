package com.investbridge.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.investbridge.dto.LoginRequestDTO;
import com.investbridge.dto.LoginResponseDTO;
import com.investbridge.model.User;
import com.investbridge.repository.UserRepository;
import com.investbridge.security.JwtTokenProvider;

@Service
@Transactional
public class AuthService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    // Login Service Logic
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        User user = userRepository.findByUserEmail(loginRequest.getUserEmail()) // Find the user whose email address matches.
                .orElseThrow(() -> new BadCredentialsException("Invalid Email")); // Throws error when find user fail.

        if (!(user.getUserPw().equals(loginRequest.getUserPw())))
            throw new BadCredentialsException("Invalid Password");

        String token = jwtTokenProvider.createToken(user.getUserEmail(), user.getUserRole().name()); // Create token based on userEmail, userRole
        return new LoginResponseDTO(token, user.getUserRole().name()); // Return responsedto(token, userRole)
    }
}
