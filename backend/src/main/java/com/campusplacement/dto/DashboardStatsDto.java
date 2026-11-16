package com.campusplacement.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {

    // General / Student metrics
    private long totalAvailableJobs;
    private long totalAppliedJobs;
    private long totalShortlisted;
    private long totalSelected;
    private int profileCompletionPercentage;
    private int skillsCount;
    private List<JobDto> recentRecommendedJobs;
    private List<ApplicationDto> recentApplications;

    // Admin specific metrics
    private long totalStudents;
    private long totalCompanies;
    private long totalJobPostings;
    private long totalApplicationsCount;
    private long totalSelectedStudents;
    private double placementPercentage;
    private Map<String, Long> departmentWisePlacement;
    private Map<String, Long> applicationStatusDistribution;

    public DashboardStatsDto() {
    }

    public long getTotalAvailableJobs() {
        return totalAvailableJobs;
    }

    public void setTotalAvailableJobs(long totalAvailableJobs) {
        this.totalAvailableJobs = totalAvailableJobs;
    }

    public long getTotalAppliedJobs() {
        return totalAppliedJobs;
    }

    public void setTotalAppliedJobs(long totalAppliedJobs) {
        this.totalAppliedJobs = totalAppliedJobs;
    }

    public long getTotalShortlisted() {
        return totalShortlisted;
    }

    public void setTotalShortlisted(long totalShortlisted) {
        this.totalShortlisted = totalShortlisted;
    }

    public long getTotalSelected() {
        return totalSelected;
    }

    public void setTotalSelected(long totalSelected) {
        this.totalSelected = totalSelected;
    }

    public int getProfileCompletionPercentage() {
        return profileCompletionPercentage;
    }

    public void setProfileCompletionPercentage(int profileCompletionPercentage) {
        this.profileCompletionPercentage = profileCompletionPercentage;
    }

    public int getSkillsCount() {
        return skillsCount;
    }

    public void setSkillsCount(int skillsCount) {
        this.skillsCount = skillsCount;
    }

    public List<JobDto> getRecentRecommendedJobs() {
        return recentRecommendedJobs;
    }

    public void setRecentRecommendedJobs(List<JobDto> recentRecommendedJobs) {
        this.recentRecommendedJobs = recentRecommendedJobs;
    }

    public List<ApplicationDto> getRecentApplications() {
        return recentApplications;
    }

    public void setRecentApplications(List<ApplicationDto> recentApplications) {
        this.recentApplications = recentApplications;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalCompanies() {
        return totalCompanies;
    }

    public void setTotalCompanies(long totalCompanies) {
        this.totalCompanies = totalCompanies;
    }

    public long getTotalJobPostings() {
        return totalJobPostings;
    }

    public void setTotalJobPostings(long totalJobPostings) {
        this.totalJobPostings = totalJobPostings;
    }

    public long getTotalApplicationsCount() {
        return totalApplicationsCount;
    }

    public void setTotalApplicationsCount(long totalApplicationsCount) {
        this.totalApplicationsCount = totalApplicationsCount;
    }

    public long getTotalSelectedStudents() {
        return totalSelectedStudents;
    }

    public void setTotalSelectedStudents(long totalSelectedStudents) {
        this.totalSelectedStudents = totalSelectedStudents;
    }

    public double getPlacementPercentage() {
        return placementPercentage;
    }

    public void setPlacementPercentage(double placementPercentage) {
        this.placementPercentage = placementPercentage;
    }

    public Map<String, Long> getDepartmentWisePlacement() {
        return departmentWisePlacement;
    }

    public void setDepartmentWisePlacement(Map<String, Long> departmentWisePlacement) {
        this.departmentWisePlacement = departmentWisePlacement;
    }

    public Map<String, Long> getApplicationStatusDistribution() {
        return applicationStatusDistribution;
    }

    public void setApplicationStatusDistribution(Map<String, Long> applicationStatusDistribution) {
        this.applicationStatusDistribution = applicationStatusDistribution;
    }
}

