package com.investbridge.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investbridge.exception.ErrorResponse;
import com.investbridge.model.db.Dashboard;
import com.investbridge.service.DashboardUpdateService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "대시보드 API")
public class DashboardController {

    //TODO 관리자 권한 부여하기 
    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);

    private final DashboardUpdateService dashboardUpdateService;

    @GetMapping("/main")
    @Operation(summary = "대시보드 메인데이터 가져오기", description = "대시보드에 보여줄 데이터를 가져옵니다.")
    public ResponseEntity<?> getMainData() {
        try{
            Dashboard dashboardData = dashboardUpdateService.getLatestStatistics();
            
            logger.info("Get Dashboard data Succeed");
            return ResponseEntity.ok(dashboardData);
        }catch(Exception e){
            logger.error("Get Dashboard data Failed : {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred : {}", e.getMessage()));
        }
    }

    @PostMapping
    @Operation(summary = "대시보드 데이터 저장", description = "대시보드에 데이터를 저장합니다.")
    public ResponseEntity<?> saveDashboard(@RequestBody Dashboard dashboard) {
        try {
            Dashboard savedDashboard = dashboardUpdateService.saveStatistics(dashboard);
            logger.info("Save Dashboard Succeed");
            return ResponseEntity.ok(savedDashboard);
        } catch (Exception e) {
            logger.error("Save Dashboard Failed : {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred : {}", e.getMessage()));
        }
    }

    @GetMapping("/latest")
    @Operation(summary = "최신 통계 가져오기", description = "최신으로 업데이트된 통계 데이터를 가져옵니다.")
    public ResponseEntity<?> getLatestStatistics() {
        try{
            Dashboard latestStatistics = dashboardUpdateService.getLatestStatistics();
            logger.info("Get Latest Statistic Data Succeed");
            return ResponseEntity.ok(latestStatistics);
        }catch(Exception e){
            logger.error("Get Latest Statistic Data Failed : {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected Error Occurred : {}", e.getMessage()));
        }
    }
}
