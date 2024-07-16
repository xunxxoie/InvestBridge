package com.investbridge.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}