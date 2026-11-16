package com.campusplacement.service;

import com.campusplacement.dto.ApplicationDto;
import com.campusplacement.entity.ApplicationStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface ApplicationService {
    ApplicationDto applyForJob(Long studentId, Long jobId);
    List<ApplicationDto> getApplicationsByStudent(Long studentId);
    List<ApplicationDto> getApplicationsByJob(Long jobId);
    List<ApplicationDto> getAllApplications();
    ApplicationDto updateApplicationStatus(Long applicationId, ApplicationStatus status, LocalDateTime interviewDate, String feedback, String notes);
    ApplicationDto getApplicationById(Long applicationId);
}

