package com.campusplacement.config;

import com.campusplacement.entity.*;
import com.campusplacement.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final AdminRepository adminRepository;
    private final SkillRepository skillRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor-based Dependency Injection (Spring Core DI)
    public DataInitializer(UserRepository userRepository,
                           StudentRepository studentRepository,
                           AdminRepository adminRepository,
                           SkillRepository skillRepository,
                           JobRepository jobRepository,
                           ApplicationRepository applicationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.adminRepository = adminRepository;
        this.skillRepository = skillRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            logger.info("Database already seeded. Skipping initial data injection.");
            return;
        }

        logger.info("Initializing campus placement default database records...");

        // 1. Seed Skills
        Map<String, Skill> skillsMap = new HashMap<>();
        String[][] initialSkills = {
                {"Java", "BACKEND"},
                {"Spring Boot", "BACKEND"},
                {"React", "FRONTEND"},
                {"JavaScript", "FRONTEND"},
                {"TypeScript", "FRONTEND"},
                {"Python", "BACKEND"},
                {"SQL", "DATABASE"},
                {"MySQL", "DATABASE"},
                {"Docker", "DEVOPS"},
                {"AWS", "CLOUD"},
                {"Git", "TOOLS"},
                {"REST APIs", "BACKEND"},
                {"Data Structures", "CORE_CS"},
                {"System Design", "CORE_CS"}
        };
        for (String[] pair : initialSkills) {
            Skill skill = skillRepository.save(new Skill(pair[0], pair[1]));
            skillsMap.put(pair[0], skill);
        }

        // 2. Seed Default Admin User
        User adminUser = new User("admin@campus.edu", passwordEncoder.encode("Admin@123"), "Prof. Robert Vance", Role.ROLE_ADMIN);
        User savedAdminUser = userRepository.save(adminUser);
        Admin admin = new Admin(savedAdminUser, "Placement Cell & Career Services", "EMP-ADM-001", "Chief Placement Officer");
        adminRepository.save(admin);

        // 3. Seed Primary Student User
        User studentUser1 = new User("student@campus.edu", passwordEncoder.encode("Student@123"), "Kartik Sharma", Role.ROLE_STUDENT);
        User savedStudentUser1 = userRepository.save(studentUser1);
        Student student1 = new Student(savedStudentUser1);
        student1.setStudentIdNum("USN2021CS089");
        student1.setDepartment("Computer Science & Engineering");
        student1.setCgpa(8.85);
        student1.setGraduationYear(2025);
        student1.setPhone("+91 98765 43210");
        student1.setBio("Passionate full-stack developer with hands-on experience in Java, Spring Boot, React, and cloud architectures. Winner of Smart Campus Hackathon.");
        student1.setLinkedinUrl("https://linkedin.com/in/kartik-sharma");
        student1.setGithubUrl("https://github.com/kartik-dev");

        Set<Skill> s1Skills = new HashSet<>();
        s1Skills.add(skillsMap.get("Java"));
        s1Skills.add(skillsMap.get("Spring Boot"));
        s1Skills.add(skillsMap.get("React"));
        s1Skills.add(skillsMap.get("SQL"));
        s1Skills.add(skillsMap.get("Git"));
        student1.setSkills(s1Skills);
        Student savedStudent1 = studentRepository.save(student1);

        // 4. Seed Secondary Student User
        User studentUser2 = new User("priya.patel@campus.edu", passwordEncoder.encode("Student@123"), "Priya Patel", Role.ROLE_STUDENT);
        User savedStudentUser2 = userRepository.save(studentUser2);
        Student student2 = new Student(savedStudentUser2);
        student2.setStudentIdNum("USN2021IT045");
        student2.setDepartment("Information Technology");
        student2.setCgpa(9.20);
        student2.setGraduationYear(2025);
        student2.setPhone("+91 98111 22334");
        student2.setBio("Algorithmic problem solver and cloud enthusiast. Solved 450+ LeetCode problems.");
        Set<Skill> s2Skills = new HashSet<>();
        s2Skills.add(skillsMap.get("Python"));
        s2Skills.add(skillsMap.get("Java"));
        s2Skills.add(skillsMap.get("AWS"));
        s2Skills.add(skillsMap.get("Docker"));
        student2.setSkills(s2Skills);
        Student savedStudent2 = studentRepository.save(student2);

        // 5. Seed Third Student User
        User studentUser3 = new User("arjun.nair@campus.edu", passwordEncoder.encode("Student@123"), "Arjun Nair", Role.ROLE_STUDENT);
        User savedStudentUser3 = userRepository.save(studentUser3);
        Student student3 = new Student(savedStudentUser3);
        student3.setStudentIdNum("USN2021EC012");
        student3.setDepartment("Electronics & Communication");
        student3.setCgpa(7.90);
        student3.setGraduationYear(2025);
        student3.setPhone("+91 97234 56789");
        student3.setBio("Embedded systems hobbyist transitioning to backend systems and IoT microservices.");
        studentRepository.save(student3);

        // 6. Seed Job Postings
        Job job1 = new Job(
                "Software Engineer - Cloud Platform",
                "Google Cloud",
                "Bengaluru / Hybrid",
                "Design and develop high-throughput microservices for Google Cloud services. Collaborate with cross-functional teams to build resilient backend components.",
                "Computer Science, Information Technology, Electronics",
                "Java, Spring Boot, Distributed Systems, Go, Docker, Kubernetes",
                8.5,
                "24 - 32 LPA",
                LocalDate.now().plusDays(25),
                5
        );
        Job savedJob1 = jobRepository.save(job1);

        Job job2 = new Job(
                "Full Stack Developer (React & Java)",
                "Microsoft India",
                "Hyderabad / Onsite",
                "Build modern, enterprise-grade cloud web applications. Own end-to-end features from React user experiences down to Spring and Azure backend microservices.",
                "Computer Science, Information Technology",
                "React, TypeScript, Java, Spring Boot, REST APIs, Azure",
                8.0,
                "18 - 24 LPA",
                LocalDate.now().plusDays(18),
                8
        );
        Job savedJob2 = jobRepository.save(job2);

        Job job3 = new Job(
                "Associate Software Engineer",
                "Amazon AWS",
                "Bengaluru / Onsite",
                "Develop high-performance computing services supporting global AWS customers. Strong knowledge of algorithms, object-oriented design, and testing is required.",
                "All Departments",
                "Java, Python, Data Structures, Algorithms, Linux",
                7.5,
                "16 - 22 LPA",
                LocalDate.now().plusDays(12),
                12
        );
        Job savedJob3 = jobRepository.save(job3);

        Job job4 = new Job(
                "Systems Engineer - Digital Transformation",
                "Infosys Ltd",
                "Pune / Hybrid",
                "Participate in enterprise digital transformation programs. Modernize legacy applications into Spring Boot microservices with React frontends.",
                "All Departments",
                "Java, SQL, HTML, CSS, JavaScript, Spring Basics",
                7.0,
                "7.5 - 9.5 LPA",
                LocalDate.now().plusDays(30),
                25
        );
        Job savedJob4 = jobRepository.save(job4);

        Job job5 = new Job(
                "Technology Consultant - AI & Analytics",
                "Deloitte Digital",
                "Mumbai / Hybrid",
                "Advise Fortune 500 clients on modern cloud architectures, generative AI integrations, and automated software pipelines.",
                "Computer Science, Information Technology",
                "Python, SQL, Machine Learning, PowerBI, Cloud Basics",
                7.5,
                "11 - 15 LPA",
                LocalDate.now().plusDays(20),
                10
        );
        Job savedJob5 = jobRepository.save(job5);

        Job job6 = new Job(
                "Cybersecurity & Cloud Systems Associate",
                "Cisco Systems",
                "Bengaluru / Hybrid",
                "Contribute to next-gen network security and cloud protection microservices.",
                "Computer Science, Information Technology, Electronics",
                "Networking, Linux, Python, C++, Docker",
                8.0,
                "14 - 18 LPA",
                LocalDate.now().plusDays(15),
                6
        );
        Job savedJob6 = jobRepository.save(job6);

        // 7. Seed Applications
        Application app1 = new Application(savedStudent1, savedJob1);
        app1.setStatus(ApplicationStatus.SHORTLISTED);
        app1.setInterviewDate(LocalDateTime.now().plusDays(4));
        app1.setFeedback("Resume cleared ATS screening with high marks in Spring Boot & React. Scheduled for Technical Round 1.");
        applicationRepository.save(app1);

        Application app2 = new Application(savedStudent1, savedJob2);
        app2.setStatus(ApplicationStatus.TECHNICAL_ROUND);
        app2.setInterviewDate(LocalDateTime.now().plusDays(6));
        app2.setFeedback("Cleared coding round with 100% test cases passed. Focus on Spring IoC & React Hooks in the interview.");
        applicationRepository.save(app2);

        Application app3 = new Application(savedStudent2, savedJob1);
        app3.setStatus(ApplicationStatus.SELECTED);
        app3.setFeedback("Outstanding technical evaluation across algorithms and system design. Formal placement offer extended.");
        applicationRepository.save(app3);

        Application app4 = new Application(savedStudent2, savedJob3);
        app4.setStatus(ApplicationStatus.HR_ROUND);
        app4.setInterviewDate(LocalDateTime.now().plusDays(3));
        applicationRepository.save(app4);

        logger.info("=======================================================================");
        logger.info("CAMPUS PLACEMENT DATABASE INITIALIZED SUCCESSFULLY!");
        logger.info("Default Admin:   admin@campus.edu   / Admin@123");
        logger.info("Default Student: student@campus.edu / Student@123");
        logger.info("=======================================================================");
    }
}

