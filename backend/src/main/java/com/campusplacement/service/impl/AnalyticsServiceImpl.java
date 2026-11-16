package com.campusplacement.service.impl;

import com.campusplacement.dto.ApplicationDto;
import com.campusplacement.dto.DashboardStatsDto;
import com.campusplacement.dto.JobDto;
import com.campusplacement.entity.*;
import com.campusplacement.repository.*;
import com.campusplacement.service.AnalyticsService;
import com.campusplacement.service.JobService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final JobService jobService;

    // Constructor-based Dependency Injection (Spring Core DI)
    public AnalyticsServiceImpl(StudentRepository studentRepository,
                                JobRepository jobRepository,
                                ApplicationRepository applicationRepository,
                                JobService jobService) {
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.jobService = jobService;
    }

    @Override
    public DashboardStatsDto getStudentDashboardStats(Long studentId) {
        DashboardStatsDto stats = new DashboardStatsDto();

        List<Job> allJobs = jobRepository.findByIsActiveTrue();
        stats.setTotalAvailableJobs(allJobs.size());

        List<Application> studentApps = applicationRepository.findByStudentId(studentId);
        stats.setTotalAppliedJobs(studentApps.size());

        long shortlisted = studentApps.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.SHORTLISTED ||
                             a.getStatus() == ApplicationStatus.TECHNICAL_ROUND ||
                             a.getStatus() == ApplicationStatus.HR_ROUND)
                .count();
        stats.setTotalShortlisted(shortlisted);

        long selected = studentApps.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.SELECTED)
                .count();
        stats.setTotalSelected(selected);

        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isPresent()) {
            Student s = studentOpt.get();
            stats.setSkillsCount(s.getSkills() != null ? s.getSkills().size() : 0);

            // Calculate profile completion percentage
            int score = 20; // user account created
            if (s.getCgpa() != null && s.getCgpa() > 0) score += 20;
            if (s.getDepartment() != null && !s.getDepartment().isEmpty()) score += 15;
            if (s.getPhone() != null && !s.getPhone().isEmpty()) score += 10;
            if (s.getBio() != null && !s.getBio().isEmpty()) score += 10;
            if (s.getSkills() != null && !s.getSkills().isEmpty()) score += 15;
            if (s.getResumeUrl() != null && !s.getResumeUrl().isEmpty()) score += 10;
            stats.setProfileCompletionPercentage(Math.min(score, 100));
        }

        // Recent recommended jobs
        List<JobDto> recommended = jobService.getRecommendedJobsForStudent(studentId);
        stats.setRecentRecommendedJobs(recommended.stream().limit(5).collect(Collectors.toList()));

        // Recent applications
        List<ApplicationDto> recentApps = studentApps.stream()
                .sorted(Comparator.comparing(Application::getAppliedAt).reversed())
                .limit(5)
                .map(this::mapApplicationToDto)
                .collect(Collectors.toList());
        stats.setRecentApplications(recentApps);

        return stats;
    }

    @Override
    public DashboardStatsDto getAdminDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        List<Student> students = studentRepository.findAll();
        stats.setTotalStudents(students.size());

        List<Job> jobs = jobRepository.findAll();
        stats.setTotalJobPostings(jobs.size());

        long distinctCompanies = jobs.stream()
                .map(Job::getCompany)
                .filter(Objects::nonNull)
                .map(String::trim)
                .map(String::toLowerCase)
                .distinct()
                .count();
        stats.setTotalCompanies(distinctCompanies);

        List<Application> applications = applicationRepository.findAll();
        stats.setTotalApplicationsCount(applications.size());

        long selectedCount = applications.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.SELECTED)
                .map(a -> a.getStudent().getId())
                .distinct()
                .count();
        stats.setTotalSelectedStudents(selectedCount);

        double rate = students.isEmpty() ? 0.0 : ((double) selectedCount / students.size()) * 100.0;
        stats.setPlacementPercentage(Math.round(rate * 10.0) / 10.0);

        // Department-wise placed students
        Map<String, Long> deptPlacement = new HashMap<>();
        for (Student s : students) {
            String dept = s.getDepartment() != null ? s.getDepartment() : "General";
            deptPlacement.putIfAbsent(dept, 0L);
        }
        for (Application a : applications) {
            if (a.getStatus() == ApplicationStatus.SELECTED) {
                String dept = a.getStudent().getDepartment() != null ? a.getStudent().getDepartment() : "General";
                deptPlacement.put(dept, deptPlacement.getOrDefault(dept, 0L) + 1L);
            }
        }
        stats.setDepartmentWisePlacement(deptPlacement);

        // Status distribution
        Map<String, Long> statusDistribution = new LinkedHashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            statusDistribution.put(status.name(), 0L);
        }
        for (Application a : applications) {
            String statusName = a.getStatus().name();
            statusDistribution.put(statusName, statusDistribution.getOrDefault(statusName, 0L) + 1L);
        }
        stats.setApplicationStatusDistribution(statusDistribution);

        return stats;
    }

    private ApplicationDto mapApplicationToDto(Application application) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(application.getId());
        dto.setStudentId(application.getStudent().getId());
        dto.setStudentName(application.getStudent().getUser().getFullName());
        dto.setStudentEmail(application.getStudent().getUser().getEmail());
        dto.setJobId(application.getJob().getId());
        dto.setJobTitle(application.getJob().getTitle());
        dto.setCompany(application.getJob().getCompany());
        dto.setSalaryPackage(application.getJob().getSalaryPackage());
        dto.setStatus(application.getStatus());
        dto.setAppliedAt(application.getAppliedAt());
        dto.setInterviewDate(application.getInterviewDate());
        return dto;
    }
}

