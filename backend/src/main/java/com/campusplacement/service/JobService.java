package com.campusplacement.service;

import com.campusplacement.dto.JobDto;

import java.util.List;

public interface JobService {
    List<JobDto> getAllJobs(Long currentStudentId, String query, String department);
    JobDto getJobById(Long id, Long currentStudentId);
    JobDto createJob(JobDto jobDto);
    JobDto updateJob(Long id, JobDto jobDto);
    void deleteJob(Long id);
    List<JobDto> getRecommendedJobsForStudent(Long studentId);
}

