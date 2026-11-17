package com.campusplacement.service.impl;

import com.campusplacement.dto.JobDto;
import com.campusplacement.entity.Application;
import com.campusplacement.entity.Job;
import com.campusplacement.entity.Skill;
import com.campusplacement.entity.Student;
import com.campusplacement.exception.ResourceNotFoundException;
import com.campusplacement.repository.ApplicationRepository;
import com.campusplacement.repository.JobRepository;
import com.campusplacement.repository.StudentRepository;
import com.campusplacement.service.JobService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;

    // Constructor-based Dependency Injection (Spring Core)
    public JobServiceImpl(JobRepository jobRepository,
                          ApplicationRepository applicationRepository,
                          StudentRepository studentRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    public List<JobDto> getAllJobs(Long currentStudentId, String query, String department) {
        List<Job> jobs = jobRepository.findAll();

        return jobs.stream()
                .filter(job -> job.getIsActive() != null && job.getIsActive())
                .filter(job -> {
                    if (query == null || query.trim().isEmpty()) return true;
                    String q = query.toLowerCase();
                    return job.getTitle().toLowerCase().contains(q) ||
                           job.getCompany().toLowerCase().contains(q) ||
                           (job.getRequiredSkills() != null && job.getRequiredSkills().toLowerCase().contains(q));
                })
                .filter(job -> {
                    if (department == null || department.trim().isEmpty() || department.equalsIgnoreCase("All")) return true;
                    return job.getEligibleDepartments() == null ||
                           job.getEligibleDepartments().toLowerCase().contains(department.toLowerCase()) ||
                           job.getEligibleDepartments().equalsIgnoreCase("All");
                })
                .map(job -> mapToDto(job, currentStudentId))
                .collect(Collectors.toList());
    }

    @Override
    public JobDto getJobById(Long id, Long currentStudentId) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found with ID: " + id));
        return mapToDto(job, currentStudentId);
    }

    @Override
    @Transactional
    public JobDto createJob(JobDto dto) {
        Job job = new Job();
        copyDtoToEntity(dto, job);
        job.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        Job saved = jobRepository.save(job);
        return mapToDto(saved, null);
    }

    @Override
    @Transactional
    public JobDto updateJob(Long id, JobDto dto) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found with ID: " + id));
        copyDtoToEntity(dto, job);
        if (dto.getIsActive() != null) {
            job.setIsActive(dto.getIsActive());
        }
        Job updated = jobRepository.save(job);
        return mapToDto(updated, null);
    }

    @Override
    @Transactional
    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job posting not found with ID: " + id);
        }
        jobRepository.deleteById(id);
    }

    @Override
    public List<JobDto> getRecommendedJobsForStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        Double studentCgpa = student.getCgpa() != null ? student.getCgpa() : 0.0;
        List<Job> activeJobs = jobRepository.findByIsActiveTrue();

        return activeJobs.stream()
                .filter(job -> job.getMinCgpa() == null || studentCgpa >= job.getMinCgpa())
                .filter(job -> {
                    if (job.getEligibleDepartments() == null || job.getEligibleDepartments().equalsIgnoreCase("All")) return true;
                    return student.getDepartment() != null && job.getEligibleDepartments().toLowerCase().contains(student.getDepartment().toLowerCase());
                })
                .map(job -> mapToDto(job, studentId))
                .collect(Collectors.toList());
    }

    private void copyDtoToEntity(JobDto dto, Job entity) {
        entity.setTitle(dto.getTitle());
        entity.setCompany(dto.getCompany());
        entity.setLocation(dto.getLocation());
        entity.setJobType(dto.getJobType() != null ? dto.getJobType() : "Full-Time");
        entity.setDescription(dto.getDescription());
        entity.setEligibleDepartments(dto.getEligibleDepartments());
        entity.setRequiredSkills(dto.getRequiredSkills());
        entity.setMinCgpa(dto.getMinCgpa() != null ? dto.getMinCgpa() : 0.0);
        entity.setSalaryPackage(dto.getSalaryPackage());
        entity.setApplicationDeadline(dto.getApplicationDeadline());
        entity.setOpenings(dto.getOpenings() != null ? dto.getOpenings() : 1);
    }

    private JobDto mapToDto(Job job, Long studentId) {
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setCompany(job.getCompany());
        dto.setLocation(job.getLocation());
        dto.setJobType(job.getJobType());
        dto.setDescription(job.getDescription());
        dto.setEligibleDepartments(job.getEligibleDepartments());
        dto.setRequiredSkills(job.getRequiredSkills());
        dto.setMinCgpa(job.getMinCgpa());
        dto.setSalaryPackage(job.getSalaryPackage());
        dto.setApplicationDeadline(job.getApplicationDeadline());
        dto.setOpenings(job.getOpenings());
        dto.setIsActive(job.getIsActive());
        dto.setCreatedAt(job.getCreatedAt());

        long count = applicationRepository.findByJobId(job.getId()).size();
        dto.setApplicantCount(count);

        if (studentId != null) {
            Optional<Student> studentOpt = studentRepository.findById(studentId);
            if (studentOpt.isPresent()) {
                Student s = studentOpt.get();
                boolean cgpaOk = (job.getMinCgpa() == null || (s.getCgpa() != null && s.getCgpa() >= job.getMinCgpa()));
                boolean deptOk = (job.getEligibleDepartments() == null ||
                        job.getEligibleDepartments().equalsIgnoreCase("All") ||
                        (s.getDepartment() != null && job.getEligibleDepartments().toLowerCase().contains(s.getDepartment().toLowerCase())));
                dto.setIsEligible(cgpaOk && deptOk);

                Optional<Application> appOpt = applicationRepository.findByStudentIdAndJobId(studentId, job.getId());
                dto.setHasApplied(appOpt.isPresent());
                dto.setApplicationStatus(appOpt.map(a -> a.getStatus().name()).orElse(null));

                // Calculate dynamic ATS Match Score based on student skills vs job required skills
                int calculatedMatch = calculateJobMatchScore(s, job);
                dto.setMatchScore(calculatedMatch);
            }
        }

        return dto;
    }

    private int calculateJobMatchScore(Student student, Job job) {
        if (job.getRequiredSkills() == null || job.getRequiredSkills().trim().isEmpty()) {
            return 75;
        }

        String[] requiredArr = job.getRequiredSkills().split(",");
        if (requiredArr.length == 0) return 75;

        Set<String> studentSkillNames = new HashSet<>();
        if (student.getSkills() != null) {
            for (Skill sk : student.getSkills()) {
                studentSkillNames.add(sk.getName().trim().toLowerCase());
            }
        }

        int matchedCount = 0;
        for (String req : requiredArr) {
            String cleanReq = req.trim().toLowerCase();
            if (studentSkillNames.stream().anyMatch(st -> st.contains(cleanReq) || cleanReq.contains(st))) {
                matchedCount++;
            }
        }

        double skillRatio = (double) matchedCount / requiredArr.length;
        // Base score between 40 and 96 depending on skills coverage
        int score = (int) Math.round(40 + (skillRatio * 52));

        // Academic alignment bonus (+4 if high CGPA)
        if (student.getCgpa() != null && job.getMinCgpa() != null && student.getCgpa() >= job.getMinCgpa() + 0.5) {
            score = Math.min(score + 4, 98);
        }

        return Math.max(score, 35);
    }
}

