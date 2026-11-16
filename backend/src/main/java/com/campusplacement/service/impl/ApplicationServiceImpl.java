package com.campusplacement.service.impl;

import com.campusplacement.dto.ApplicationDto;
import com.campusplacement.entity.*;
import com.campusplacement.exception.BadRequestException;
import com.campusplacement.exception.DuplicateApplicationException;
import com.campusplacement.exception.ResourceNotFoundException;
import com.campusplacement.repository.ApplicationRepository;
import com.campusplacement.repository.JobRepository;
import com.campusplacement.repository.StudentRepository;
import com.campusplacement.service.ApplicationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;

    // Constructor-based Dependency Injection (Spring Core)
    public ApplicationServiceImpl(ApplicationRepository applicationRepository,
                                  StudentRepository studentRepository,
                                  JobRepository jobRepository) {
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
    }

    @Override
    @Transactional
    public ApplicationDto applyForJob(Long studentId, Long jobId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found with ID: " + jobId));

        // Prevent duplicate applications
        if (applicationRepository.existsByStudentIdAndJobId(studentId, jobId)) {
            throw new DuplicateApplicationException("You have already applied for this position: " + job.getTitle() + " at " + job.getCompany());
        }

        // Eligibility check
        if (job.getMinCgpa() != null && student.getCgpa() != null && student.getCgpa() < job.getMinCgpa()) {
            throw new BadRequestException("Minimum CGPA criteria of " + job.getMinCgpa() + " is not met. Your CGPA: " + student.getCgpa());
        }

        Application application = new Application(student, job);
        Application saved = applicationRepository.save(application);

        return mapToDto(saved);
    }

    @Override
    public List<ApplicationDto> getApplicationsByStudent(Long studentId) {
        return applicationRepository.findByStudentId(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDto> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDto> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ApplicationDto updateApplicationStatus(Long applicationId, ApplicationStatus status, LocalDateTime interviewDate, String feedback, String notes) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        if (status != null) {
            application.setStatus(status);
        }
        if (interviewDate != null) {
            application.setInterviewDate(interviewDate);
        }
        if (feedback != null) {
            application.setFeedback(feedback);
        }
        if (notes != null) {
            application.setNotes(notes);
        }

        Application updated = applicationRepository.save(application);
        return mapToDto(updated);
    }

    @Override
    public ApplicationDto getApplicationById(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));
        return mapToDto(application);
    }

    private ApplicationDto mapToDto(Application application) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(application.getId());
        dto.setStudentId(application.getStudent().getId());
        dto.setStudentName(application.getStudent().getUser().getFullName());
        dto.setStudentEmail(application.getStudent().getUser().getEmail());
        dto.setStudentDepartment(application.getStudent().getDepartment());
        dto.setStudentCgpa(application.getStudent().getCgpa());
        dto.setStudentPhone(application.getStudent().getPhone());
        dto.setResumeUrl(application.getStudent().getResumeUrl());
        dto.setJobId(application.getJob().getId());
        dto.setJobTitle(application.getJob().getTitle());
        dto.setCompany(application.getJob().getCompany());
        dto.setSalaryPackage(application.getJob().getSalaryPackage());
        dto.setStatus(application.getStatus());
        dto.setAppliedAt(application.getAppliedAt());
        dto.setInterviewDate(application.getInterviewDate());
        dto.setFeedback(application.getFeedback());
        dto.setNotes(application.getNotes());
        return dto;
    }
}

