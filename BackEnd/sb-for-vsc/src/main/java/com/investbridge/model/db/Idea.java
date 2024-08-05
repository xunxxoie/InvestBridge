package com.investbridge.model.db;

import java.util.Date;
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

    private String userName;
    private String title;
    private String content;
    private String gitLink;
    private String notionLink;

    private List<String> categories;
    private List<FileMetaData> files;

    private Integer likes;
    private Integer favorites;

    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Date updatedAt;

    private boolean isContracted;
}