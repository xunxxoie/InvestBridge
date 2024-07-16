package com.investbridge.model;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import com.investbridge.model.enums.FileMetadata;
import com.investbridge.model.enums.IdeaCategory;

@Document(collection = "ideas")
public class Idea {
    @Id
    private String id;

    //Property
    private String title;
    private String content;
    private String gitLink;
    private String notionLink;

    private List<IdeaCategory> categories;
    private List<FileMetadata> files;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Date createdAt;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Date updatedAt;

    private boolean isContracted; //true/false of idea is contacted with Supporter
    private User supporter;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Date contractedDate; // Date when contract is succeeded

    //Constructor
    public Idea() {}

    public Idea(String id, String title, String content, String gitLink, String notionLink,
            List<IdeaCategory> categories, List<FileMetadata> files, Date createdAt, Date updatedAt,
            boolean isContracted, User supporter, Date contractedDate) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.gitLink = gitLink;
        this.notionLink = notionLink;
        this.categories = categories;
        this.files = files;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isContracted = isContracted;
        this.supporter = supporter;
        this.contractedDate = contractedDate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getGitLink() {
        return gitLink;
    }

    public void setGitLink(String gitLink) {
        this.gitLink = gitLink;
    }

    public String getNotionLink() {
        return notionLink;
    }

    public void setNotionLink(String notionLink) {
        this.notionLink = notionLink;
    }

    public List<IdeaCategory> getCategories() {
        return categories;
    }

    public void setCategories(List<IdeaCategory> categories) {
        this.categories = categories;
    }

    public List<FileMetadata> getFiles() {
        return files;
    }

    public void setFiles(List<FileMetadata> files) {
        this.files = files;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isContracted() {
        return isContracted;
    }

    public void setContracted(boolean isContracted) {
        this.isContracted = isContracted;
    }

    public User getSupporter() {
        return supporter;
    }

    public void setSupporter(User supporter) {
        this.supporter = supporter;
    }

    public Date getContractedDate() {
        return contractedDate;
    }

    public void setContractedDate(Date contractedDate) {
        this.contractedDate = contractedDate;
    }

}
