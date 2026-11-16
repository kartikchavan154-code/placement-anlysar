package com.campusplacement.dto;

public class InterviewEvaluationRequest {

    private String jobRole;
    private String question;
    private String studentAnswer;
    private String category; // TECHNICAL or HR

    public InterviewEvaluationRequest() {
    }

    public InterviewEvaluationRequest(String jobRole, String question, String studentAnswer, String category) {
        this.jobRole = jobRole;
        this.question = question;
        this.studentAnswer = studentAnswer;
        this.category = category;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getStudentAnswer() {
        return studentAnswer;
    }

    public void setStudentAnswer(String studentAnswer) {
        this.studentAnswer = studentAnswer;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}

