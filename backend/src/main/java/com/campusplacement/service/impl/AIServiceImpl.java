package com.campusplacement.service.impl;

import com.campusplacement.ai.AIResponseFallbackProvider;
import com.campusplacement.ai.GeminiClient;
import com.campusplacement.dto.*;
import com.campusplacement.entity.Skill;
import com.campusplacement.entity.Student;
import com.campusplacement.exception.ResourceNotFoundException;
import com.campusplacement.repository.StudentRepository;
import com.campusplacement.service.AIService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIServiceImpl implements AIService {

    private static final Logger logger = LoggerFactory.getLogger(AIServiceImpl.class);

    private final GeminiClient geminiClient;
    private final AIResponseFallbackProvider fallbackProvider;
    private final StudentRepository studentRepository;

    // Constructor-based Dependency Injection (Spring Core DI)
    public AIServiceImpl(GeminiClient geminiClient,
                         AIResponseFallbackProvider fallbackProvider,
                         StudentRepository studentRepository) {
        this.geminiClient = geminiClient;
        this.fallbackProvider = fallbackProvider;
        this.studentRepository = studentRepository;
    }

    @Override
    public ResumeAnalysisDto analyzeResume(String fileName, String extractedText, String targetJobDescription) {
        logger.info("Performing AI Resume Analysis for file: '{}'", fileName);

        if (geminiClient.isConfigured()) {
            String prompt = String.format("""
                You are an expert technical recruiter and ATS specialist.
                Analyze the following resume text against the target job requirements.
                Resume Text: %s
                Target Job Description: %s
                
                Provide feedback covering:
                1. Extracted Technical Skills
                2. Missing critical skills
                3. ATS Match Score (0 to 100)
                4. Key Strengths
                5. Actionable Improvement Suggestions
                """,
                extractedText.substring(0, Math.min(extractedText.length(), 2000)),
                targetJobDescription != null ? targetJobDescription : "Full Stack Software Developer"
            );

            Optional<String> geminiResult = geminiClient.callGemini(prompt);
            if (geminiResult.isPresent()) {
                logger.info("Successfully received LLM response from Gemini API.");
            }
        }

        // Return structured ATS analysis report
        return fallbackProvider.generateResumeAnalysis(fileName, extractedText);
    }

    @Override
    public List<CareerRecommendationDto> getCareerRecommendations(Long studentId) {
        logger.info("Generating AI Career Recommendations for Student ID: {}", studentId);

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        Set<String> skillNames = student.getSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());

        return fallbackProvider.generateCareerRecommendations(
                student.getDepartment(),
                student.getCgpa(),
                skillNames
        );
    }

    @Override
    public List<InterviewQuestionDto> generateInterviewQuestions(String jobRole, String category, int count) {
        logger.info("Generating AI Interview Questions for Role: '{}', Category: '{}', Count: {}", jobRole, category, count);
        return fallbackProvider.generateInterviewQuestions(jobRole, category, count);
    }

    @Override
    public InterviewEvaluationResponse evaluateAnswer(InterviewEvaluationRequest request) {
        logger.info("Evaluating interview answer for Role: '{}', Question: '{}'",
                request.getJobRole(), request.getQuestion());

        if (geminiClient.isConfigured() && request.getStudentAnswer() != null && request.getStudentAnswer().length() > 20) {
            String prompt = String.format("""
                Evaluate this interview answer as a senior interviewer.
                Role: %s
                Category: %s
                Question: %s
                Candidate Answer: %s
                """,
                request.getJobRole(), request.getCategory(), request.getQuestion(), request.getStudentAnswer()
            );
            geminiClient.callGemini(prompt);
        }

        return fallbackProvider.evaluateAnswer(
                request.getJobRole(),
                request.getQuestion(),
                request.getStudentAnswer(),
                request.getCategory()
        );
    }
}

