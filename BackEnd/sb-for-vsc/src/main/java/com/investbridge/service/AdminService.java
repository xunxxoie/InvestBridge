package com.investbridge.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.investbridge.model.db.Idea;
import com.investbridge.model.db.PatchNote;
import com.investbridge.model.db.User;
import com.investbridge.model.dto.Admin.AdminIdeaInfoResponse;
import com.investbridge.model.dto.Admin.AdminUserInfoResponse;
import com.investbridge.model.dto.Admin.PatchNoteRequest;
import com.investbridge.model.dto.Admin.PatchNoteResponse;
import com.investbridge.model.dto.Idea.IdeaSummaryResponse;
import com.investbridge.model.dto.Object.FileMetaData;
import com.investbridge.model.enums.UserRole;
import com.investbridge.repository.IdeaRepository;
import com.investbridge.repository.PatchNoteRepository;
import com.investbridge.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final IdeaRepository ideaRepository;
    private final PatchNoteRepository patchNoteRepository;

    public PatchNoteResponse findPatchNote(String version){

        PatchNote patchNote = patchNoteRepository.findByVersion(version)
                                                    .orElse(null);
        if (patchNote == null) {
            return null; 
        }
                                            
        List<FileMetaData> files = patchNote.getFiles();
        
        PatchNoteResponse responseDTO = PatchNoteResponse.builder()
                            .title(patchNote.getTitle())
                            .content(patchNote.getContent())
                            .version(patchNote.getVersion())
                            .adminId(patchNote.getAdminId())
                            .createdAt(patchNote.getCreatedAt())
                            .files(files)
                            .build();
        
        return responseDTO;
    }

    public String addPatchNote(PatchNoteRequest request){

        //Exception Handling for Already exits PatchNote version
        if(patchNoteRepository.findByVersion(request.getVersion()).isPresent())
            throw new RuntimeException("Already Exits Version");

        List<FileMetaData> fileMetadata = convertFilesToFileMetadata(request.getFiles());
    
        PatchNote newPatchNote = PatchNote.builder()
            .version(request.getVersion())
            .title(request.getTitle())
            .content(request.getContent())
            .adminId(request.getAdminId())
            .createdAt(LocalDateTime.now())
            .files(fileMetadata)
            .build();

        PatchNote savedPatchNote = patchNoteRepository.save(newPatchNote);

        return savedPatchNote.getId();
    }

    public List<AdminUserInfoResponse> findAllUserInfo(){
        List<User> userInfoList = userRepository.findAll();
        return userInfoList.stream()
                .map(user -> AdminUserInfoResponse.builder() //Convert userInfoList's type to AdminUserInfoDTO type 
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

    public List<IdeaSummaryResponse> findUserIdea(String userId){

        List<Idea> userIdeaSumList = ideaRepository.findByUserId(userId).orElse(Collections.emptyList());
        return userIdeaSumList.stream()
                .map(ideaSum -> IdeaSummaryResponse.builder()
                                .title(ideaSum.getTitle())
                                .cratedAt(ideaSum.getCreatedAt().format(DateTimeFormatter.ISO_DATE))
                                .isContracted(ideaSum.isContracted())
                                .build())
                .collect(Collectors.toList());
    }

    public List<AdminIdeaInfoResponse> findAllIdeaInfo(){
        List<Idea> ideaInfoList = ideaRepository.findAll();
        return ideaInfoList.stream()
                .map(idea -> AdminIdeaInfoResponse.builder()
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

    private List<FileMetaData> convertFilesToFileMetadata(List<MultipartFile> files) {
        List<FileMetaData> fileMetadata = new ArrayList<>();
        if (files != null) {
            for (MultipartFile file : files) {
                try {
                    FileMetaData metadata = new FileMetaData();
                    metadata.setFileName(file.getOriginalFilename());
                    metadata.setFileType(file.getContentType());
                    metadata.setFileSize(file.getSize());
                    metadata.setFileData(file.getBytes());
                    fileMetadata.add(metadata);
                } catch (IOException e) {
                    throw new RuntimeException("Error occurred with File: " + file.getOriginalFilename(), e);
                }
            }
        }
        return fileMetadata;
    }

    public List<AdminUserInfoResponse> findUsersByRole(String role){

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
                .map(user -> AdminUserInfoResponse.builder()
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