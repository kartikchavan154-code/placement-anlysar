package com.campusplacement.controller;

import com.campusplacement.dto.JobDto;
import com.campusplacement.service.JobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    // Constructor-based Dependency Injection (Spring Core)
    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<List<JobDto>> getAllJobs(
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department) {
        return ResponseEntity.ok(jobService.getAllJobs(studentId, search, department));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJobById(
            @PathVariable Long id,
            @RequestParam(required = false) Long studentId) {
        return ResponseEntity.ok(jobService.getJobById(id, studentId));
    }

    @GetMapping("/recommended")
    public ResponseEntity<List<JobDto>> getRecommendedJobs(@RequestParam Long studentId) {
        return ResponseEntity.ok(jobService.getRecommendedJobsForStudent(studentId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<JobDto> createJob(@RequestBody JobDto jobDto) {
        JobDto created = jobService.createJob(jobDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<JobDto> updateJob(@PathVariable Long id, @RequestBody JobDto jobDto) {
        return ResponseEntity.ok(jobService.updateJob(id, jobDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}

