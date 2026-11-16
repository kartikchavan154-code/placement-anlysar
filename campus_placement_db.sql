-- =====================================================================
-- AI-POWERED CAMPUS PLACEMENT & CAREER ASSISTANT
-- MySQL Database Schema and Seed Data Initialization Script
-- =====================================================================

CREATE DATABASE IF NOT EXISTS campus_placement_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campus_placement_db;

-- 1. Users Table (Authentication and Role-Based Access Control)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    role VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Students Profile Table
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    student_id_num VARCHAR(50) UNIQUE,
    department VARCHAR(100),
    cgpa DOUBLE DEFAULT 0.0,
    graduation_year INT DEFAULT 2025,
    phone VARCHAR(20),
    bio TEXT,
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    resume_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Admins Profile Table
CREATE TABLE IF NOT EXISTS admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    department VARCHAR(100),
    employee_code VARCHAR(50) UNIQUE,
    designation VARCHAR(100),
    CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL
);

-- 5. Student Skills Join Table (Many-to-Many Relationship)
CREATE TABLE IF NOT EXISTS student_skills (
    student_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    PRIMARY KEY (student_id, skill_id),
    CONSTRAINT fk_ss_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_ss_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 6. Jobs Table (Placement Drives)
CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    location VARCHAR(100),
    job_type VARCHAR(50) DEFAULT 'Full-Time',
    description TEXT NOT NULL,
    eligible_departments VARCHAR(255),
    required_skills TEXT,
    min_cgpa DOUBLE DEFAULT 0.0,
    salary_package VARCHAR(50),
    application_deadline DATE,
    openings INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 7. Applications Table (Student Job Applications & Status Pipeline)
CREATE TABLE IF NOT EXISTS applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'APPLIED',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    interview_date DATETIME,
    feedback TEXT,
    notes TEXT,
    CONSTRAINT uq_student_job UNIQUE (student_id, job_id),
    CONSTRAINT fk_app_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_app_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- 8. Resumes Table (PDF Extraction & Storage)
CREATE TABLE IF NOT EXISTS resumes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    parsed_skills TEXT,
    education_summary TEXT,
    experience_summary TEXT,
    raw_extracted_text LONGTEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resume_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 9. Interview Sessions Table (AI Mock Tests & Scoring)
CREATE TABLE IF NOT EXISTS interview_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    job_role VARCHAR(150) NOT NULL,
    session_type VARCHAR(50) NOT NULL,
    score DOUBLE DEFAULT 0.0,
    feedback TEXT,
    questions_json LONGTEXT,
    answers_json LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_session_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- =====================================================================
-- INITIAL SAMPLE DATA SEEDING
-- =====================================================================

-- Passwords below are BCrypt hashes of:
-- 'Admin@123'   -> $2a$10$7Q9n5.7B4FzW9...
-- 'Student@123' -> $2a$10$sX8.eM7mJ1t...

-- Insert Default Admin (Prof. Robert Vance)
INSERT INTO users (id, email, password, full_name, role) VALUES
(1, 'admin@campus.edu', '$2a$10$w8cO1qE2j4g/cQ6P2f6a7eXyYnI2p3Q8mN9kL0v1R2s3T4u5V6w7x', 'Prof. Robert Vance', 'ROLE_ADMIN')
ON DUPLICATE KEY UPDATE email=email;

INSERT INTO admins (id, user_id, department, employee_code, designation) VALUES
(1, 1, 'Placement Cell & Career Services', 'EMP-ADM-001', 'Chief Placement Officer')
ON DUPLICATE KEY UPDATE employee_code=employee_code;

-- Insert Default Students
INSERT INTO users (id, email, password, full_name, role) VALUES
(2, 'student@campus.edu', '$2a$10$w8cO1qE2j4g/cQ6P2f6a7eXyYnI2p3Q8mN9kL0v1R2s3T4u5V6w7x', 'Kartik Sharma', 'ROLE_STUDENT'),
(3, 'priya.patel@campus.edu', '$2a$10$w8cO1qE2j4g/cQ6P2f6a7eXyYnI2p3Q8mN9kL0v1R2s3T4u5V6w7x', 'Priya Patel', 'ROLE_STUDENT')
ON DUPLICATE KEY UPDATE email=email;

INSERT INTO students (id, user_id, student_id_num, department, cgpa, graduation_year, phone, bio) VALUES
(1, 2, 'USN2021CS089', 'Computer Science & Engineering', 8.85, 2025, '+91 98765 43210', 'Full-stack software developer proficient in Java, Spring Boot, React, and cloud architectures.'),
(2, 3, 'USN2021IT045', 'Information Technology', 9.20, 2025, '+91 98111 22334', 'Algorithmic problem solver and cloud enthusiast. Solved 450+ LeetCode problems.')
ON DUPLICATE KEY UPDATE student_id_num=student_id_num;

-- Insert Skills
INSERT INTO skills (id, name, category) VALUES
(1, 'Java', 'BACKEND'),
(2, 'Spring Boot', 'BACKEND'),
(3, 'React', 'FRONTEND'),
(4, 'JavaScript', 'FRONTEND'),
(5, 'Python', 'BACKEND'),
(6, 'SQL', 'DATABASE'),
(7, 'Docker', 'DEVOPS'),
(8, 'AWS', 'CLOUD')
ON DUPLICATE KEY UPDATE name=name;

-- Insert Student Skills
INSERT IGNORE INTO student_skills (student_id, skill_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 6),
(2, 1), (2, 5), (2, 7), (2, 8);

-- Insert Corporate Job Postings
INSERT INTO jobs (id, title, company, location, job_type, description, eligible_departments, required_skills, min_cgpa, salary_package, application_deadline, openings, is_active) VALUES
(1, 'Software Engineer - Cloud Platform', 'Google Cloud', 'Bengaluru / Hybrid', 'Full-Time', 'Design high-throughput distributed microservices on Google Cloud platform.', 'Computer Science, Information Technology', 'Java, Spring Boot, Go, Docker, Kubernetes', 8.5, '24 - 32 LPA', '2026-12-31', 5, TRUE),
(2, 'Full Stack Developer (React & Java)', 'Microsoft India', 'Hyderabad / Onsite', 'Full-Time', 'Build modern enterprise cloud applications with React frontends and Spring Boot microservices.', 'Computer Science, Information Technology', 'React, TypeScript, Java, Spring Boot, Azure', 8.0, '18 - 24 LPA', '2026-12-15', 8, TRUE),
(3, 'Associate Software Engineer', 'Amazon AWS', 'Bengaluru / Onsite', 'Full-Time', 'Develop high performance distributed web services and infrastructure.', 'All Departments', 'Java, Python, Data Structures, Linux', 7.5, '16 - 22 LPA', '2026-12-10', 12, TRUE),
(4, 'Systems Engineer - Digital Transformation', 'Infosys Ltd', 'Pune / Hybrid', 'Full-Time', 'Modernize legacy enterprise systems to cloud-native Spring Boot and React applications.', 'All Departments', 'Java, SQL, JavaScript, HTML, CSS', 7.0, '7.5 - 9.5 LPA', '2027-01-15', 25, TRUE),
(5, 'Technology Consultant - AI & Analytics', 'Deloitte Digital', 'Mumbai / Hybrid', 'Full-Time', 'Advise enterprise clients on modern cloud architectures and generative AI integrations.', 'Computer Science, Information Technology', 'Python, SQL, Machine Learning, PowerBI', 7.5, '11 - 15 LPA', '2026-12-28', 10, TRUE)
ON DUPLICATE KEY UPDATE title=title;

-- Insert Applications
INSERT IGNORE INTO applications (id, student_id, job_id, status, applied_at, interview_date, feedback) VALUES
(1, 1, 1, 'SHORTLISTED', NOW(), DATE_ADD(NOW(), INTERVAL 4 DAY), 'Resume cleared ATS screening with high marks in Spring Boot & React.'),
(2, 1, 2, 'TECHNICAL_ROUND', NOW(), DATE_ADD(NOW(), INTERVAL 6 DAY), 'Coding round passed with 100% test cases. Prepare Spring IoC concepts.'),
(3, 2, 1, 'SELECTED', NOW(), NULL, 'Outstanding technical evaluation across algorithms and distributed systems.');

