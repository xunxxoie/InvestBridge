package com.investbridge.model.dto.Idea;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IdeaCreateResponse {
    private String ideaId;
    private String userId;
}
