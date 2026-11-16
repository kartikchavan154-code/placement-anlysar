package com.campusplacement.service;

import com.campusplacement.dto.DashboardStatsDto;

public interface AnalyticsService {
    DashboardStatsDto getStudentDashboardStats(Long studentId);
    DashboardStatsDto getAdminDashboardStats();
}

