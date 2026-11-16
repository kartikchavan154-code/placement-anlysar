package com.campusplacement.dto;

import java.util.List;

public class CareerRecommendationDto {

    private String jobRole;
    private int matchPercentage;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String rationale;
    private String marketDemand; // HIGH, VERY_HIGH, MODERATE
    private String averageStartingSalary;
    private List<RoadmapStepDto> learningRoadmap;
    private List<String> recommendedCertifications;

    public CareerRecommendationDto() {
    }

    public static class RoadmapStepDto {
        private int stepNumber;
        private String topic;
        private String duration;
        private String description;
        private List<String> learningResources;

        public RoadmapStepDto() {
        }

        public RoadmapStepDto(int stepNumber, String topic, String duration, String description, List<String> learningResources) {
            this.stepNumber = stepNumber;
            this.topic = topic;
            this.duration = duration;
            this.description = description;
            this.learningResources = learningResources;
        }

        public int getStepNumber() {
            return stepNumber;
        }

        public void setStepNumber(int stepNumber) {
            this.stepNumber = stepNumber;
        }

        public String getTopic() {
            return topic;
        }

        public void setTopic(String topic) {
            this.topic = topic;
        }

        public String getDuration() {
            return duration;
        }

        public void setDuration(String duration) {
            this.duration = duration;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public List<String> getLearningResources() {
            return learningResources;
        }

        public void setLearningResources(List<String> learningResources) {
            this.learningResources = learningResources;
        }
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public int getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(int matchPercentage) {
        this.matchPercentage = matchPercentage;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public String getRationale() {
        return rationale;
    }

    public void setRationale(String rationale) {
        this.rationale = rationale;
    }

    public String getMarketDemand() {
        return marketDemand;
    }

    public void setMarketDemand(String marketDemand) {
        this.marketDemand = marketDemand;
    }

    public String getAverageStartingSalary() {
        return averageStartingSalary;
    }

    public void setAverageStartingSalary(String averageStartingSalary) {
        this.averageStartingSalary = averageStartingSalary;
    }

    public List<RoadmapStepDto> getLearningRoadmap() {
        return learningRoadmap;
    }

    public void setLearningRoadmap(List<RoadmapStepDto> learningRoadmap) {
        this.learningRoadmap = learningRoadmap;
    }

    public List<String> getRecommendedCertifications() {
        return recommendedCertifications;
    }

    public void setRecommendedCertifications(List<String> recommendedCertifications) {
        this.recommendedCertifications = recommendedCertifications;
    }
}

