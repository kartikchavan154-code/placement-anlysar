package com.campusplacement.controller;

import com.campusplacement.dto.DashboardStatsDto;
import com.campusplacement.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    // Constructor-based Dependency Injection (Spring Core)
    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<DashboardStatsDto> getStudentStats(@PathVariable Long studentId) {
        return ResponseEntity.ok(analyticsService.getStudentDashboardStats(studentId));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStatsDto> getAdminStats() {
        return ResponseEntity.ok(analyticsService.getAdminDashboardStats());
    }
}

