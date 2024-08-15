package com.investbridge.service;

import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.investbridge.model.db.Idea;
import com.investbridge.model.db.User;
import com.investbridge.model.dto.Object.AdminIdeaInfoDTO;
import com.investbridge.model.dto.Object.AdminUserInfoDTO;
import com.investbridge.model.dto.Object.IdeaSummaryDTO;
import com.investbridge.model.enums.UserRole;
import com.investbridge.repository.IdeaRepository;
import com.investbridge.repository.UserRepository;

@Service
@Transactional
public class AdminService {


    private final UserRepository userRepository;
    private final IdeaRepository ideaRepository;

    public AdminService(UserRepository userRepository, IdeaRepository ideaRepository) {
        this.userRepository = userRepository;
        this.ideaRepository = ideaRepository;
    }

    public List<AdminUserInfoDTO> findAllUserInfo(){
        List<User> userInfoList = userRepository.findAll();
        return userInfoList.stream()
                .map(user -> AdminUserInfoDTO.builder() //Convert userInfoList's type to AdminUserInfoDTO type 
                            .id(user.getId())
                            .userId(user.getUserId())
                            .userEmail(user.getUserEmail())
                            .phoneNumber(user.getPhoneNumber())
                            .birth(user.getBirth().format(DateTimeFormatter.ISO_DATE))
                            .role(user.getUserRole().name())
                            .createdAt(user.getCreatedAt().format(DateTimeFormatter.ISO_DATE))
                            .isBlocked(user.isBlocked())
                            .build())
                .collect(Collectors.toList());
    }

    public List<IdeaSummaryDTO> findUserIdea(String userId){

        List<Idea> userIdeaSumList = ideaRepository.findByUserId(userId).orElse(Collections.emptyList());
        return userIdeaSumList.stream()
                .map(ideaSum -> IdeaSummaryDTO.builder()
                                .title(ideaSum.getTitle())
                                .cratedAt(ideaSum.getCreatedAt().format(DateTimeFormatter.ISO_DATE))
                                .isContracted(ideaSum.isContracted())
                                .build())
                .collect(Collectors.toList());
    }

    public List<AdminIdeaInfoDTO> findAllIdeaInfo(){
        List<Idea> ideaInfoList = ideaRepository.findAll();
        return ideaInfoList.stream()
                .map(idea -> AdminIdeaInfoDTO.builder()
                            .id(idea.getId())
                            .userId(idea.getUserId())
                            .title(idea.getTitle())
                            .content(idea.getContent())
                            .gitLink(idea.getGitLink())
                            .notionLink(idea.getNotionLink())
                            .likes(idea.getLikes())
                            .favorites(idea.getFavorites())
                            .createdAt(idea.getCreatedAt().format(DateTimeFormatter.ISO_DATE))
                            .updatedAt(idea.getUpdatedAt().format(DateTimeFormatter.ISO_DATE))
                            .isContracted(idea.isContracted())
                            .isBlocked(idea.isBlocked())
                            .build())
                    .collect(Collectors.toList());
    }

    public List<AdminUserInfoDTO> findUsersByRole(String role){

        UserRole userRole;

        if(role.equals("Dreamer")){
            userRole = UserRole.DREAMER;
        }else if(role.equals("Supporter")){
            userRole = UserRole.SUPPORTER;
        }else{
            userRole = UserRole.ADMIN;
        }

        List<User> userInfoList = userRepository.findByUserRole(userRole);
        return userInfoList.stream()
                .map(user -> AdminUserInfoDTO.builder()
                            .id(user.getId())
                            .userId(user.getUserId())
                            .userEmail(user.getUserEmail())
                            .phoneNumber(user.getPhoneNumber())
                            .birth(user.getBirth().format(DateTimeFormatter.ISO_DATE))
                            .role(user.getUserRole().name())
                            .createdAt(user.getCreatedAt().format(DateTimeFormatter.ISO_DATE))
                            .isBlocked(user.isBlocked())
                            .build())
                .collect(Collectors.toList());
    }
}