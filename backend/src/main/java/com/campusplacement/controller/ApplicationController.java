package com.campusplacement.controller;

import com.campusplacement.dto.ApplicationDto;
import com.campusplacement.entity.ApplicationStatus;
import com.campusplacement.service.ApplicationService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    // Constructor-based Dependency Injection (Spring Core)
    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<ApplicationDto> applyForJob(@RequestBody Map<String, Long> payload) {
        Long studentId = payload.get("studentId");
        Long jobId = payload.get("jobId");
        ApplicationDto created = applicationService.applyForJob(studentId, jobId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ApplicationDto>> getApplicationsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(applicationService.getApplicationsByStudent(studentId));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ApplicationDto>> getApplicationsByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJob(jobId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ApplicationDto>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDto> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApplicationDto> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        
        String statusStr = (String) payload.get("status");
        ApplicationStatus status = statusStr != null ? ApplicationStatus.valueOf(statusStr) : null;
        
        LocalDateTime interviewDate = null;
        if (payload.get("interviewDate") != null) {
            try {
                interviewDate = LocalDateTime.parse((String) payload.get("interviewDate"));
            } catch (Exception ignored) {
            }
        }

        String feedback = (String) payload.get("feedback");
        String notes = (String) payload.get("notes");

        ApplicationDto updated = applicationService.updateApplicationStatus(id, status, interviewDate, feedback, notes);
        return ResponseEntity.ok(updated);
    }
}

