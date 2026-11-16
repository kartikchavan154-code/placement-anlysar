package com.campusplacement.dto;

import java.util.List;

public class InterviewEvaluationResponse {

    private int score; // 0 - 100
    private String rating; // EXCELLENT, GOOD, AVERAGE, NEEDS_IMPROVEMENT
    private List<String> strengths;
    private List<String> improvements;
    private String modelAnswer;
    private String detailedFeedback;

    public InterviewEvaluationResponse() {
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getImprovements() {
        return improvements;
    }

    public void setImprovements(List<String> improvements) {
        this.improvements = improvements;
    }

    public String getModelAnswer() {
        return modelAnswer;
    }

    public void setModelAnswer(String modelAnswer) {
        this.modelAnswer = modelAnswer;
    }

    public String getDetailedFeedback() {
        return detailedFeedback;
    }

    public void setDetailedFeedback(String detailedFeedback) {
        this.detailedFeedback = detailedFeedback;
    }
}

