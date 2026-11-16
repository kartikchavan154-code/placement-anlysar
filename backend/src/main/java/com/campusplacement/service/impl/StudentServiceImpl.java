package com.campusplacement.service.impl;

import com.campusplacement.dto.StudentProfileDto;
import com.campusplacement.entity.Skill;
import com.campusplacement.entity.Student;
import com.campusplacement.entity.User;
import com.campusplacement.exception.ResourceNotFoundException;
import com.campusplacement.repository.SkillRepository;
import com.campusplacement.repository.StudentRepository;
import com.campusplacement.repository.UserRepository;
import com.campusplacement.service.StudentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    // Constructor-based Dependency Injection (Spring Core)
    public StudentServiceImpl(StudentRepository studentRepository,
                              UserRepository userRepository,
                              SkillRepository skillRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
    }

    @Override
    public StudentProfileDto getStudentProfile(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));
        return mapToDto(student);
    }

    @Override
    public StudentProfileDto getStudentProfileByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user ID: " + userId));
        return mapToDto(student);
    }

    @Override
    @Transactional
    public StudentProfileDto updateStudentProfile(Long studentId, StudentProfileDto profileDto) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        if (profileDto.getFullName() != null) {
            User user = student.getUser();
            user.setFullName(profileDto.getFullName());
            userRepository.save(user);
        }

        if (profileDto.getDepartment() != null) student.setDepartment(profileDto.getDepartment());
        if (profileDto.getCgpa() != null) student.setCgpa(profileDto.getCgpa());
        if (profileDto.getGraduationYear() != null) student.setGraduationYear(profileDto.getGraduationYear());
        if (profileDto.getStudentIdNum() != null) student.setStudentIdNum(profileDto.getStudentIdNum());
        if (profileDto.getPhone() != null) student.setPhone(profileDto.getPhone());
        if (profileDto.getBio() != null) student.setBio(profileDto.getBio());
        if (profileDto.getLinkedinUrl() != null) student.setLinkedinUrl(profileDto.getLinkedinUrl());
        if (profileDto.getGithubUrl() != null) student.setGithubUrl(profileDto.getGithubUrl());
        if (profileDto.getResumeUrl() != null) student.setResumeUrl(profileDto.getResumeUrl());

        if (profileDto.getSkills() != null) {
            Set<Skill> managedSkills = resolveSkills(profileDto.getSkills());
            student.setSkills(managedSkills);
        }

        Student updated = studentRepository.save(student);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public StudentProfileDto updateStudentSkills(Long studentId, Set<String> skillNames) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        Set<Skill> managedSkills = resolveSkills(skillNames);
        student.setSkills(managedSkills);
        Student updated = studentRepository.save(student);
        return mapToDto(updated);
    }

    @Override
    public List<StudentProfileDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentProfileDto> getStudentsByDepartment(String department) {
        return studentRepository.findByDepartment(department).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentProfileDto> getStudentsByMinCgpa(Double minCgpa) {
        return studentRepository.findByCgpaGreaterThanEqual(minCgpa).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private Set<Skill> resolveSkills(Set<String> skillNames) {
        Set<Skill> resolved = new HashSet<>();
        for (String name : skillNames) {
            String trimmed = name.trim();
            if (trimmed.isEmpty()) continue;
            Skill skill = skillRepository.findByNameIgnoreCase(trimmed)
                    .orElseGet(() -> skillRepository.save(new Skill(trimmed, "TECHNICAL")));
            resolved.add(skill);
        }
        return resolved;
    }

    private StudentProfileDto mapToDto(Student student) {
        StudentProfileDto dto = new StudentProfileDto();
        dto.setId(student.getId());
        dto.setUserId(student.getUser().getId());
        dto.setFullName(student.getUser().getFullName());
        dto.setEmail(student.getUser().getEmail());
        dto.setStudentIdNum(student.getStudentIdNum());
        dto.setDepartment(student.getDepartment());
        dto.setCgpa(student.getCgpa());
        dto.setGraduationYear(student.getGraduationYear());
        dto.setPhone(student.getPhone());
        dto.setBio(student.getBio());
        dto.setLinkedinUrl(student.getLinkedinUrl());
        dto.setGithubUrl(student.getGithubUrl());
        dto.setResumeUrl(student.getResumeUrl());
        dto.setSkills(student.getSkills().stream().map(Skill::getName).collect(Collectors.toSet()));
        dto.setCreatedAt(student.getCreatedAt());
        dto.setUpdatedAt(student.getUpdatedAt());
        return dto;
    }
}

