package com.investbridge.model.db;

import java.util.Date;

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
@Document(collection = "blacklisted_tokens")
public class BlacklistedToken {
    @Id
    private String id;
    
    private String token;
    private Date expiryDate;
}
