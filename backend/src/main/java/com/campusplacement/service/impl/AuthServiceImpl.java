package com.campusplacement.service.impl;

import com.campusplacement.dto.AuthRequest;
import com.campusplacement.dto.AuthResponse;
import com.campusplacement.dto.RegisterRequest;
import com.campusplacement.entity.*;
import com.campusplacement.exception.BadRequestException;
import com.campusplacement.repository.*;
import com.campusplacement.security.JwtTokenProvider;
import com.campusplacement.security.UserPrincipal;
import com.campusplacement.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    // Constructor Injection (Spring Core)
    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserRepository userRepository,
                           StudentRepository studentRepository,
                           AdminRepository adminRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public AuthResponse login(AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Long studentId = null;
        Long adminId = null;

        if (userPrincipal.getRole() == Role.ROLE_STUDENT) {
            studentId = studentRepository.findByUserId(userPrincipal.getId())
                    .map(Student::getId).orElse(null);
        } else if (userPrincipal.getRole() == Role.ROLE_ADMIN) {
            adminId = adminRepository.findByUserId(userPrincipal.getId())
                    .map(Admin::getId).orElse(null);
        }

        return new AuthResponse(
                jwt,
                userPrincipal.getId(),
                userPrincipal.getUsername(),
                userPrincipal.getFullName(),
                userPrincipal.getRole(),
                studentId,
                adminId
        );
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email address is already registered: " + registerRequest.getEmail());
        }

        Role role = registerRequest.getRole() != null ? registerRequest.getRole() : Role.ROLE_STUDENT;

        User user = new User(
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getFullName(),
                role
        );
        User savedUser = userRepository.save(user);

        Long studentId = null;
        Long adminId = null;

        if (role == Role.ROLE_STUDENT) {
            Student student = new Student(savedUser);
            student.setDepartment(registerRequest.getDepartment() != null ? registerRequest.getDepartment() : "Computer Science & Engineering");
            student.setCgpa(registerRequest.getCgpa() != null ? registerRequest.getCgpa() : 8.0);
            student.setStudentIdNum(registerRequest.getStudentIdNum() != null ? registerRequest.getStudentIdNum() : "STU" + System.currentTimeMillis() % 100000);
            student.setGraduationYear(registerRequest.getGraduationYear() != null ? registerRequest.getGraduationYear() : 2025);
            student.setPhone(registerRequest.getPhone());
            Student savedStudent = studentRepository.save(student);
            studentId = savedStudent.getId();
        } else if (role == Role.ROLE_ADMIN) {
            Admin admin = new Admin(
                    savedUser,
                    registerRequest.getDepartment() != null ? registerRequest.getDepartment() : "Placement Cell",
                    registerRequest.getEmployeeCode() != null ? registerRequest.getEmployeeCode() : "ADM" + System.currentTimeMillis() % 10000,
                    registerRequest.getDesignation() != null ? registerRequest.getDesignation() : "Placement Officer"
            );
            Admin savedAdmin = adminRepository.save(admin);
            adminId = savedAdmin.getId();
        }

        // Generate token immediately on registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getEmail(),
                        registerRequest.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getRole(),
                studentId,
                adminId
        );
    }
}

