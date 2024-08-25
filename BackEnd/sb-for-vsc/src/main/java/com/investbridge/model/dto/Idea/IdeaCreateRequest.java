package com.investbridge.model.dto.Idea;

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
public class IdeaCreateRequest {
    private String userId;

    private String title;
    private String projectSummary;
    private String teamSummary;
    
    private String content;
    private String gitLink;
    private String notionLink;
    
    private List<String> categories;
    private List<MultipartFile> files;
}