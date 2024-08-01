package com.investbridge.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
}
