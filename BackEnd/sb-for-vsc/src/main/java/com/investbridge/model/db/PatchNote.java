package com.investbridge.model.db;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.investbridge.model.dto.Object.FileMetaData;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "patch_notes")
public class PatchNote {
    @Id
    private String id;

    private String version;
    private String title;
    private String content;
    private String adminId;

    private List<FileMetaData> files;

    @CreatedDate
    private LocalDateTime createdAt;

}
