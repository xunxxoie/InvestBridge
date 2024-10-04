package com.investbridge.model.db;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.CreatedDate;
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
    private List<Idea> topIdeaThisWeek;
    @CreatedDate
    private LocalDateTime updatedAt;
}
