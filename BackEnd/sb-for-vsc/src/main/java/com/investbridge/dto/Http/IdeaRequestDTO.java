package com.investbridge.dto.Http;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IdeaRequestDTO {
    private String userName;
    private String title;
    private String content;
    private String gitLink;
    private String notionLink;
    
    private List<String> categories;
    private List<MultipartFile> files;
}