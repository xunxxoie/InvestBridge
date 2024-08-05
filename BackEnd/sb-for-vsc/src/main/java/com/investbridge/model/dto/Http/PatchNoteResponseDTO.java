package com.investbridge.model.dto.Http;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatchNoteResponseDTO {
    private String title;
    private String content;
    private String version;
    private String adminId;
}
