package com.investbridge.model.db;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
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
@Document(collection = "ideas")
public class Idea {
    @Id
    private String id;

    private String userId;

    private String title;
    private String projectSummary;
    private String teamSummary;
    private String content;

    private String gitLink;
    private String notionLink;

    private List<FileMetaData> files;
    private List<String> categories;
    
    private Integer likes;
    private Integer favorites;
    private Integer views; // 추가

    private boolean isContracted;
    private String supporterName;
    private LocalDateTime contractedDate;

    @Builder.Default
    private List<String> likedUsers = new ArrayList<>();

    @Builder.Default
    private List<String> favoritedUsers = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private boolean isBlocked;

    private LocalDateTime lastViewed;
}

