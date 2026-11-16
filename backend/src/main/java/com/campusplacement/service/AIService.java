package com.campusplacement.service;

import com.campusplacement.dto.*;

import java.util.List;

public interface AIService {
    ResumeAnalysisDto analyzeResume(String fileName, String extractedText, String targetJobDescription);
    List<CareerRecommendationDto> getCareerRecommendations(Long studentId);
    List<InterviewQuestionDto> generateInterviewQuestions(String jobRole, String category, int count);
    InterviewEvaluationResponse evaluateAnswer(InterviewEvaluationRequest request);
}

