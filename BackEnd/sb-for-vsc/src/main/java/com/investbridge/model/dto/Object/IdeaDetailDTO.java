package com.investbridge.model.dto.Object;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IdeaDetailDTO {
    private String ideaId;
    private String dreamerId;
    
    private String title;
    private String projectSummary;
    private String teamSummary;
    private String content;

    private Integer likes;
    private Integer favorites;

    private List<String> categories;

    private boolean isContracted;

    private boolean isOwner;
}
