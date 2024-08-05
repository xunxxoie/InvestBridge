package com.investbridge.model.dto.Http;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IdeaResponseDTO {
    private String ideaId;
    private String userName;
}
