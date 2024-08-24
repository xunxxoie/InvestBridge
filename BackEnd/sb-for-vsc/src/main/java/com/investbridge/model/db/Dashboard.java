package com.investbridge.model.db;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "dashboard")
public class Dashboard {
    @Id
    private String id;
    private List<SubscribersOverTime> subscribersOverTime;
    private long totalSubscribers;
    private long newSubscribersLast1Day;
    private long supportersCount;
    private long dreamersCount;
    private double supporterToDreamerRatio;
    private Map<String, Long> ideasPerField;
    private double matchingRate;
    @CreatedDate
    private LocalDateTime updatedAt;
}
