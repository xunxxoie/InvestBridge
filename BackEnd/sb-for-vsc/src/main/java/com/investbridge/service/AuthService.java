package com.investbridge.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        User user = userRepository.findByUserEmail(loginRequest.getUserEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid Email"));

        if (!(user.getUserPw().equals(loginRequest.getUserPw()))) {
            System.out.println(user.getUserPw());
            System.out.println(loginRequest.getUserPw());
            
            throw new BadCredentialsException("Invalid Password");
        }

        String token = jwtTokenProvider.createToken(user.getUserEmail(), user.getUserRole().name());
        return new LoginResponseDTO(token, user.getUserRole().name());
    }
}