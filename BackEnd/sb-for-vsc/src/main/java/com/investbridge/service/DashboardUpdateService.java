package com.investbridge.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.investbridge.model.db.Dashboard;
import com.investbridge.model.db.SubscribersOverTime;
import com.investbridge.repository.DashboardRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class DashboardUpdateService {
    private static final int MAX_DAYS = 5;

    private IdeaService ideaService;
    private UserService userService;
    private DashboardRepository dashboardRepository;

    private static final Logger logger = LoggerFactory.getLogger(DashboardUpdateService.class);

    @Scheduled(cron = "0 5 * * * ?") // 매 5분마다 실행
    public void updateStatistics() {
        logger.info("updateStatistics called");

        LocalDate today = LocalDate.now();
        long totalSubscribers = userService.getTotalSubscribers();
        long newSubscribers = userService.getNewSubscribersLast1Day();
        long supportersCount = userService.getSupportersCount();
        long dreamersCount = userService.getDreamersCount();
        double supporterToDreamerRatio = userService.calculateSupporterToDreamerRatio();
        Map<String, Long> ideasPerField = ideaService.getIdeasPerField();
        double matchingRate = ideaService.calculateMatchingRate();

        Dashboard dashboard = dashboardRepository.findAll().stream()
                .reduce((first, second) -> second)
                .orElse(Dashboard.builder().build());

        List<SubscribersOverTime> subscribersOverTime = dashboard.getSubscribersOverTime();
        if (subscribersOverTime == null) {
            subscribersOverTime = new ArrayList<>();
        }
        subscribersOverTime.add(SubscribersOverTime.builder()
                .date(today)
                .totalSubscribers(totalSubscribers)
                .newSubscribers(newSubscribers)
                .build());

        dashboard = Dashboard.builder()
                .id(dashboard.getId()) // 기존 ID 유지
                .subscribersOverTime(subscribersOverTime)
                .totalSubscribers(totalSubscribers)
                .newSubscribersLast1Day(newSubscribers)
                .supportersCount(supportersCount)
                .dreamersCount(dreamersCount)
                .supporterToDreamerRatio(supporterToDreamerRatio)
                .ideasPerField(ideasPerField)
                .matchingRate(matchingRate)
                .updatedAt(LocalDateTime.now())
                .build();
        
        List<SubscribersOverTime> updatedSubscribersOverTime = getUpdatedSubscribersOverTime(dashboard);
        dashboard.setSubscribersOverTime(updatedSubscribersOverTime);
        logger.info("Dashboard updated: " + dashboard.toString());
        
        saveStatistics(dashboard);
    }

     private List<SubscribersOverTime> getUpdatedSubscribersOverTime(Dashboard dashboard) {
        Dashboard latestDashboard = dashboardRepository.findTopByOrderByUpdatedAtDesc();
        List<SubscribersOverTime> currentSubscribersOverTime = latestDashboard != null ? latestDashboard.getSubscribersOverTime() : List.of();

        SubscribersOverTime newEntry = SubscribersOverTime.builder()
                .date(LocalDate.now())
                .totalSubscribers(dashboard.getTotalSubscribers())
                .newSubscribers(dashboard.getNewSubscribersLast1Day())
                .build();

        currentSubscribersOverTime.add(newEntry);

        return currentSubscribersOverTime.stream()
                .sorted((o1, o2) -> o2.getDate().compareTo(o1.getDate())) // 최신 날짜 먼저 정렬
                .limit(MAX_DAYS) // 최근 5개만 추출
                .collect(Collectors.toList());
    }

    public Dashboard getLatestStatistics() {
        return dashboardRepository.findAll().stream()
                .reduce((first, second) -> second)
                .orElse(new Dashboard());
    }

    public Dashboard saveStatistics(Dashboard dashboard) {
        Dashboard savedDashboard = dashboardRepository.save(dashboard);
        logger.info("Saved Dashboard: " + savedDashboard.toString());
        return savedDashboard;
    }
}
