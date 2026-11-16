package com.campusplacement.controller;

import com.campusplacement.dto.*;
import com.campusplacement.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    // Constructor-based Dependency Injection (Spring Core)
    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze-resume")
    public ResponseEntity<ResumeAnalysisDto> analyzeResume(@RequestBody Map<String, String> payload) {
        String fileName = payload.getOrDefault("fileName", "resume.pdf");
        String resumeText = payload.getOrDefault("resumeText", "");
        String targetJobRole = payload.getOrDefault("targetJobRole", "Full Stack Developer");
        return ResponseEntity.ok(aiService.analyzeResume(fileName, resumeText, targetJobRole));
    }

    @PostMapping("/recommend-career")
    public ResponseEntity<List<CareerRecommendationDto>> recommendCareer(@RequestBody Map<String, Long> payload) {
        Long studentId = payload.get("studentId");
        return ResponseEntity.ok(aiService.getCareerRecommendations(studentId));
    }

    @PostMapping("/generate-interview")
    public ResponseEntity<List<InterviewQuestionDto>> generateInterview(@RequestBody Map<String, Object> payload) {
        String jobRole = (String) payload.getOrDefault("jobRole", "Software Engineer");
        String category = (String) payload.getOrDefault("category", "TECHNICAL");
        int count = payload.containsKey("count") ? ((Number) payload.get("count")).intValue() : 5;
        return ResponseEntity.ok(aiService.generateInterviewQuestions(jobRole, category, count));
    }

    @PostMapping("/evaluate-answer")
    public ResponseEntity<InterviewEvaluationResponse> evaluateAnswer(@RequestBody InterviewEvaluationRequest request) {
        return ResponseEntity.ok(aiService.evaluateAnswer(request));
    }
}

