package com.investbridge.model.dto.Object;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminIdeaInfoDTO {

    private String id;
    private String userName;
    private String title;
    private String content;
    private String gitLink;
    private String notionLink;
    private Integer likes;
    private Integer favorites;

    private String createdAt;
    private String updatedAt;

    private boolean isContracted;
    private boolean isBlocked;
    
}
