package com.investbridge.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        if (!passwordEncoder.matches(request.getUserPw(), user.getUserPw())) {
            throw new BadCredentialsException("Invalid Password");
        }

        String token = jwtTokenProvider.createToken(user.getId(), user.getUserEmail(), user.getUserName(), user.getPhoneNumber(), user.getUserRole().toString()); // Create token based on user info
        return new LoginResponseDTO(token, user.getUserRole().name()); // Return responsedto(token, userRole)
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
            .build();
        
        User savedUser = userRepository.save(newUser);

        return new RegisterResponseDTO(savedUser.getId());
    }
}