package com.investbridge.model.db;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscribersOverTime {
    private LocalDate date;
    private long totalSubscribers;
    private long newSubscribers;
}
