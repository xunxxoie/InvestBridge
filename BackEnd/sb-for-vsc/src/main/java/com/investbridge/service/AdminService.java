package com.investbridge.service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.investbridge.model.db.PatchNote;
import com.investbridge.model.db.User;
import com.investbridge.model.dto.Http.PatchNoteRequestDTO;
import com.investbridge.model.dto.Http.PatchNoteResponseDTO;
import com.investbridge.model.dto.Object.AdminUserInfoDTO;
import com.investbridge.repository.PatchNoteRepository;
import com.investbridge.repository.UserRepository;

@Service
@Transactional
public class AdminService {

    private final PatchNoteRepository patchNoteRepository;
    private final UserRepository userRepository;
    //private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    public AdminService(PatchNoteRepository patchNoteRepository, UserRepository userRepository) {
        this.patchNoteRepository = patchNoteRepository;
        this.userRepository = userRepository;
    }

    public PatchNoteResponseDTO findPatchNote(String version){
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

    public String addPatchNote(PatchNoteRequestDTO request){

        //Exception Handling for Already exits PatchNote version
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

    public List<String> findAllPatchNoteVersions(){
        List<String> versions = patchNoteRepository.findAllVersions();
        return versions;
    }

    public List<AdminUserInfoDTO> findAllUserInfo(){
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
}
