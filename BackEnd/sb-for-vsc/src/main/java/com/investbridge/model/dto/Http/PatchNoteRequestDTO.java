package com.investbridge.model.dto.Http;

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
public class PatchNoteRequestDTO {
    private String title;
    private String content;
    private String version;
    private String adminId;
    private List<MultipartFile> files;
}