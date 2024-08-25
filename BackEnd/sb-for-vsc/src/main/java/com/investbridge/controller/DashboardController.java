package com.investbridge.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.investbridge.model.db.Dashboard;
import com.investbridge.service.DashboardUpdateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);

    @Autowired
    private DashboardUpdateService dashboardUpdateService;

    @GetMapping("/main")
    public ResponseEntity<Dashboard> getMainData() {
        Dashboard dashboardData = dashboardUpdateService.getLatestStatistics();
        logger.info("Fetched main data: " + dashboardData.toString());
        return ResponseEntity.ok(dashboardData);
    }

    @PostMapping("/dashboard")
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

    public DashboardController(DashboardUpdateService dashboardUpdateService) {
        this.dashboardUpdateService = dashboardUpdateService;
    }

    @GetMapping("/latest")
    public Dashboard getLatestStatistics() {
        Dashboard latestStatistics = dashboardUpdateService.getLatestStatistics();
        logger.info("Fetched latest statistics: " + latestStatistics.toString());
        return latestStatistics;
    }
}
