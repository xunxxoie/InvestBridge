package com.investbridge.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.investbridge.dto.Http.IdeaRequestDTO;
import com.investbridge.dto.Http.IdeaResponseDTO;
import com.investbridge.model.FileMetaData;
import com.investbridge.model.Idea;
import com.investbridge.repository.IdeaRepository;
import com.investbridge.repository.UserRepository;
import com.investbridge.security.JwtTokenProvider;

@Service
@Transactional
public class IdeaService {
    private final IdeaRepository ideaRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    
    public IdeaService(IdeaRepository ideaRepository, UserRepository userRepository,
            JwtTokenProvider jwtTokenProvider) {
        this.ideaRepository = ideaRepository;
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public IdeaResponseDTO createIdea(IdeaRequestDTO request){

        // Convert MultipartFile to FileMetaData to save in db
        List<FileMetaData> fileMetadata = new ArrayList<>();
        if(request.getFiles() != null){
            for(MultipartFile file : request.getFiles()){
                try{
                    FileMetaData metadata = new FileMetaData();
                    metadata.setFileName(file.getOriginalFilename());
                    metadata.setFileType(file.getContentType());
                    metadata.setFileSize(file.getSize());
                    metadata.setFileData(file.getBytes()); //BLOB Rule!! Convert file to byte array
                    
                    fileMetadata.add(metadata);
                }catch(IOException e){
                    throw new RuntimeException("Problem with this File: " + file.getOriginalFilename());
                }
            }
        }

        Idea newIdea = Idea.builder()
            .userName(request.getUserName())
            .title(request.getTitle())
            .content(request.getContent())
            .gitLink(request.getGitLink())
            .notionLink(request.getNotionLink())
            .categories(request.getCategories())
            .files(fileMetadata)
            .createdAt(new Date())
            .updatedAt(new Date())
            .isContracted(false)
            .build();

        Idea savedIdea = ideaRepository.save(newIdea);

        return IdeaResponseDTO.builder()
            .ideaId(savedIdea.getId())
            .userName(savedIdea.getUserName())
            .build();
    }
}
