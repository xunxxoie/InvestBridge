package com.investbridge.model.dto.Object;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IdeaSummaryDTO {
    private String title;
    
    private String cratedAt;
    private String updatedAt;

    private boolean isContracted;
}