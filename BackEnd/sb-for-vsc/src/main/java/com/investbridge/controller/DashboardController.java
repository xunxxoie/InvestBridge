package com.investbridge.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.model.db.Dashboard;
import com.investbridge.service.DashboardUpdateService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/dashborad")
@AllArgsConstructor
public class DashboardController {

    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);

    private final DashboardUpdateService dashboardUpdateService;

    @GetMapping("/main")
    @Operation(summary = "대시보드 메인데이터 가져오기", description = "대시보드에 보여줄 데이터를 가져옵니다.")
    public ResponseEntity<Dashboard> getMainData() {
        Dashboard dashboardData = dashboardUpdateService.getLatestStatistics();
        logger.info("Fetched main data: " + dashboardData.toString());
        return ResponseEntity.ok(dashboardData);
    }

    @PostMapping
    @Operation(summary = "대시보드 데이터 저장", description = "대시보드에 데이터를 저장합니다.")
    public ResponseEntity<Dashboard> saveDashboard(@RequestBody Dashboard dashboard) {
        try {
            Dashboard savedDashboard = dashboardUpdateService.saveStatistics(dashboard);
            logger.info("Saved dashboard: " + savedDashboard.toString());
            return ResponseEntity.ok(savedDashboard);
        } catch (Exception e) {
            logger.error("Error saving dashboard", e);
            return ResponseEntity.status(500).body(null);
        }
    }
    @GetMapping("/latest")
    @Operation(summary = "최신 통계 가져오기", description = "최신으로 업데이트된 통계 데이터를 가져옵니다.")
    public Dashboard getLatestStatistics() {
        Dashboard latestStatistics = dashboardUpdateService.getLatestStatistics();
        logger.info("Fetched latest statistics: " + latestStatistics.toString());
        return latestStatistics;
    }
}
