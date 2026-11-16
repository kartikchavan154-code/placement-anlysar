package com.campusplacement.controller;

import com.campusplacement.dto.StudentProfileDto;
import com.campusplacement.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    // Constructor-based Dependency Injection (Spring Core)
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentProfileDto>> getAllStudents(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Double minCgpa) {
        if (department != null && !department.isEmpty()) {
            return ResponseEntity.ok(studentService.getStudentsByDepartment(department));
        }
        if (minCgpa != null) {
            return ResponseEntity.ok(studentService.getStudentsByMinCgpa(minCgpa));
        }
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentProfileDto> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentProfile(id));
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<StudentProfileDto> getStudentProfile(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentProfile(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<StudentProfileDto> getStudentByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(studentService.getStudentProfileByUserId(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentProfileDto> updateStudent(
            @PathVariable Long id,
            @RequestBody StudentProfileDto profileDto) {
        return ResponseEntity.ok(studentService.updateStudentProfile(id, profileDto));
    }

    @PutMapping("/{id}/skills")
    public ResponseEntity<StudentProfileDto> updateSkills(
            @PathVariable Long id,
            @RequestBody Set<String> skills) {
        return ResponseEntity.ok(studentService.updateStudentSkills(id, skills));
    }
}

