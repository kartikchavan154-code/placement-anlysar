package com.campusplacement.controller;

import com.campusplacement.dto.ResumeAnalysisDto;
import com.campusplacement.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    // Constructor-based Dependency Injection (Spring Core)
    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ResumeAnalysisDto> uploadResume(
            @RequestParam("studentId") Long studentId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "targetJobRole", required = false) String targetJobRole) {
        ResumeAnalysisDto analysis = resumeService.uploadAndAnalyzeResume(studentId, file, targetJobRole);
        return ResponseEntity.ok(analysis);
    }

    @GetMapping("/latest/{studentId}")
    public ResponseEntity<ResumeAnalysisDto> getLatestAnalysis(
            @PathVariable Long studentId,
            @RequestParam(value = "targetJobRole", required = false) String targetJobRole) {
        ResumeAnalysisDto analysis = resumeService.getLatestAnalysis(studentId, targetJobRole);
        if (analysis == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(analysis);
    }
}

