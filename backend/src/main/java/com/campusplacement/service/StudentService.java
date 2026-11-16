package com.campusplacement.service;

import com.campusplacement.dto.StudentProfileDto;

import java.util.List;
import java.util.Set;

public interface StudentService {
    StudentProfileDto getStudentProfile(Long studentId);
    StudentProfileDto getStudentProfileByUserId(Long userId);
    StudentProfileDto updateStudentProfile(Long studentId, StudentProfileDto profileDto);
    StudentProfileDto updateStudentSkills(Long studentId, Set<String> skillNames);
    List<StudentProfileDto> getAllStudents();
    List<StudentProfileDto> getStudentsByDepartment(String department);
    List<StudentProfileDto> getStudentsByMinCgpa(Double minCgpa);
}

