package com.investbridge.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.investbridge.model.db.PatchNote;
import com.investbridge.model.dto.Admin.PatchNoteRequest;
import com.investbridge.model.dto.Admin.PatchNoteResponse;
import com.investbridge.model.dto.Object.FileMetaData;
import com.investbridge.repository.PatchNoteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatchNoteService {

    private static final Logger logger = LoggerFactory.getLogger(PatchNoteService.class);

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
                            .createdAt(patchNote.getCreatedAt()) // 추가
                            .files(files) // 추가
                            .build();
        
        return responseDTO;
    }

        public String addPatchNote(PatchNoteRequest request){

        //Exception Handling for Already exits PatchNote version
        if(patchNoteRepository.findByVersion(request.getVersion()).isPresent())
            throw new RuntimeException("Already Exits Version");

        List<FileMetaData> fileMetadata = convertFilesToFileMetadata(request.getFiles()); // 추가
    
        PatchNote newPatchNote = PatchNote.builder()
            .version(request.getVersion())
            .title(request.getTitle())
            .content(request.getContent())
            .adminId(request.getAdminId())
            .createdAt(LocalDateTime.now()) // 추가
            .files(fileMetadata) // 추가
            .build();

        PatchNote savedPatchNote = patchNoteRepository.save(newPatchNote);

        return savedPatchNote.getId();
    }
    
    public List<String> findAllPatchNoteVersions(){
        List<String> versions = patchNoteRepository.findAllVersions();
        return versions;
    }


    public List<PatchNoteResponse> findAllPatchNotes() {
        return patchNoteRepository.findAll().stream()
                .map(patchNote -> PatchNoteResponse.builder()
                        .version(patchNote.getVersion())
                        .title(patchNote.getTitle())
                        .content(patchNote.getContent())
                        .adminId(patchNote.getAdminId())
                        .createdAt(patchNote.getCreatedAt())
                        .files(patchNote.getFiles())
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

    public void updatePatchNoteByVersion(String version, PatchNoteRequest request) {
        PatchNote patchNote = patchNoteRepository.findByVersion(version).orElseThrow(() ->
                new RuntimeException("Patch Note not found for version: " + version));

        List<FileMetaData> fileMetadata = convertFilesToFileMetadata(request.getFiles());

        patchNote.setTitle(request.getTitle());
        patchNote.setContent(request.getContent());
        patchNote.setAdminId(request.getAdminId());
        patchNote.setFiles(fileMetadata);

        patchNoteRepository.save(patchNote);
    }

    public void deletePatchNoteByVersion(String version) {
        PatchNote patchNote = patchNoteRepository.findByVersion(version)
                                                .orElseThrow(() -> new RuntimeException("Patch Note not found for version: " + version));

        patchNoteRepository.delete(patchNote);
    }
}
