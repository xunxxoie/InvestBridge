package com.investbridge.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.investbridge.controller.AuthController;
import com.investbridge.dto.Http.PatchNoteRequestDTO;
import com.investbridge.dto.Http.PatchNoteResponseDTO;
import com.investbridge.model.PatchNote;
import com.investbridge.repository.PatchNoteRepository;

@Service
@Transactional
public class AdminService {
    private final PatchNoteRepository patchNoteRepository;
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    public AdminService(PatchNoteRepository patchNoteRepository){
        this.patchNoteRepository = patchNoteRepository;
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

    public List<String> getAllVersions(){
        List<String> versions = patchNoteRepository.findAllVersions();
        return versions;
    }
}
