package com.investbridge.service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.investbridge.controller.AuthController;
import com.investbridge.dto.Http.PatchNoteRequestDTO;
import com.investbridge.dto.Http.PatchNoteResponseDTO;
import com.investbridge.dto.Object.AdminUserInfoDTO;
import com.investbridge.model.PatchNote;
import com.investbridge.model.User;
import com.investbridge.repository.PatchNoteRepository;
import com.investbridge.repository.UserRepository;

@Service
@Transactional
public class AdminService {
    private final PatchNoteRepository patchNoteRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    public AdminService(PatchNoteRepository patchNoteRepository, UserRepository userRepository) {
        this.patchNoteRepository = patchNoteRepository;
        this.userRepository = userRepository;
    }

    public PatchNoteResponseDTO getPatchnote(String version){
        PatchNote patchNote = patchNoteRepository.findByVersion(version)
                                                    .orElse(null);
        
        PatchNoteResponseDTO responseDTO = PatchNoteResponseDTO.builder()
                            .title(patchNote.getTitle())
                            .content(patchNote.getContent())
                            .version(patchNote.getVersion())
                            .adminId(patchNote.getAdminId())
                            .build();
        
        return responseDTO;
    }

    public String createPatchNote(PatchNoteRequestDTO request){

        logger.info("{}", request);
        if(patchNoteRepository.findByVersion(request.getVersion()).isPresent())
            throw new RuntimeException("Already Exits Version");

        PatchNote newPatchNote = PatchNote.builder()
            .version(request.getVersion())
            .title(request.getTitle())
            .content(request.getContent())
            .adminId(request.getAdminId())
            .build();

        PatchNote savedPatchNote = patchNoteRepository.save(newPatchNote);

        return savedPatchNote.getId();
    }

    public List<AdminUserInfoDTO> getUsersInfo(){
        List<User> userInfoList = userRepository.findAll();
        return userInfoList.stream()
                .map(user -> AdminUserInfoDTO.builder() //Convert usreIfoList's type to AdminUserInfoDTO type 
                            .id(user.getId())
                            .userId(user.getUserId())
                            .userEmail(user.getUserEmail())
                            .phoneNumber(user.getPhoneNumber())
                            .birth(user.getBirth().format(DateTimeFormatter.ISO_DATE))
                            .role(user.getUserRole().name())
                            .build())
                .collect(Collectors.toList());
    }

    public List<String> getAllVersions(){
        List<String> versions = patchNoteRepository.findAllVersions();
        return versions;
    }
}
