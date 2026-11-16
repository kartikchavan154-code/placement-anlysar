package com.campusplacement.dto;

import java.util.List;

public class InterviewQuestionDto {

    private Long id;
    private String question;
    private String category; // TECHNICAL, HR, SYSTEM_DESIGN
    private String difficulty; // EASY, MEDIUM, HARD
    private List<String> expectedKeyPoints;
    private String sampleAnswer;
    
    // For MCQ quizzes
    private Boolean isMcq = false;
    private List<String> options;
    private Integer correctOptionIndex;
    private String explanation;

    public InterviewQuestionDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public List<String> getExpectedKeyPoints() {
        return expectedKeyPoints;
    }

    public void setExpectedKeyPoints(List<String> expectedKeyPoints) {
        this.expectedKeyPoints = expectedKeyPoints;
    }

    public String getSampleAnswer() {
        return sampleAnswer;
    }

    public void setSampleAnswer(String sampleAnswer) {
        this.sampleAnswer = sampleAnswer;
    }

    public Boolean getIsMcq() {
        return isMcq;
    }

    public void setIsMcq(Boolean mcq) {
        isMcq = mcq;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public Integer getCorrectOptionIndex() {
        return correctOptionIndex;
    }

    public void setCorrectOptionIndex(Integer correctOptionIndex) {
        this.correctOptionIndex = correctOptionIndex;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}

