# AI-Powered Campus Placement & Career Assistant

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.14-38B2AC.svg)](https://tailwindcss.com/)
[![Java](https://img.shields.io/badge/Java-17%20%7C%2023-orange.svg)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-purple.svg)](https://ai.google.dev/)

An enterprise-grade, full-stack campus recruitment and career intelligence platform designed to empower colleges, placement cells, and students. The application streamlines end-to-end placement drives—from student academic profile management and corporate job postings to Apache PDFBox resume parsing, ATS scoring, AI career roadmaps, and mock interview simulations.

---

## 🏛️ System Architecture

```
                                  ┌───────────────────────────────────────────────┐
                                  │               React 18 Frontend               │
                                  │   (Vite, Tailwind CSS, Lucide Icons, Recharts)│
                                  └──────────────────────┬────────────────────────┘
                                                         │ REST APIs & JWT
                                                         ▼
                                  ┌───────────────────────────────────────────────┐
                                  │              Spring Boot Backend              │
                                  │   IoC / DI, Spring Security, Spring Data REST │
                                  └──────────┬──────────────────────┬─────────────┘
                                             │                      │
                   ┌─────────────────────────┴────────┐             └────────────────────────┐
                   ▼                                  ▼                                      ▼
    ┌─────────────────────────────┐    ┌─────────────────────────────┐        ┌─────────────────────────────┐
    │     MySQL / H2 Database     │    │   Apache PDFBox Text Parser │        │  Google Gemini / Fallback AI│
    │  Students, Jobs, Resumes,   │    │ Private Resume ATS Analysis │        │ Mock Questions, Evaluations,│
    │  Applications, Skills       │    │   and Skill Gap Extraction  │        │ Career Roadmaps & Insights  │
    └─────────────────────────────┘    └─────────────────────────────┘        └─────────────────────────────┘
```

---

## ⚡ Key Highlights & Core Requirements Demonstrated

### 1. Spring Core Concepts
- **IoC Container & ApplicationContext:** Demonstrated throughout component scanning, application context lifecycle events, and bean discovery.
- **Dependency Injection:** Strictly uses **constructor-based dependency injection** across all service and controller layers.
- **Stereotype Annotations:** Clear separation of `@Component`, `@Service`, `@Repository`, and `@Configuration`.
- **Bean Lifecycle Callbacks:** Demonstrated in `SpringCoreDemonstrator.java` via `@PostConstruct`, `@PreDestroy`, `InitializingBean.afterPropertiesSet()`, and `DisposableBean.destroy()`.
- **XML-Based Bean Configuration:** Demonstrated via `src/main/resources/spring-core-context.xml` and `@ImportResource("classpath:spring-core-context.xml")` defining `XmlPlacementAuditService`.

### 2. Spring MVC & REST API
- RESTful HTTP endpoints (`@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PathVariable`, `@RequestParam`, `@RequestBody`).
- Centralized exception handling via `@ControllerAdvice` (`GlobalExceptionHandler`) delivering structured JSON error payloads with timestamps and validation field messages.
- Spring Data REST (`@RepositoryRestResource`) providing HAL/JSON endpoints for `/api/rest/jobs-rest` and `/api/rest/students-rest`.

### 3. Database & JPA Architecture
- Entities: `User`, `Student`, `Admin`, `Job`, `Application`, `Resume`, `Skill`, `InterviewSession`.
- Relationships:
  - `User` 1:1 `Student` / `Admin`
  - `Student` M:N `Skill` (via `student_skills` join table)
  - `Student` 1:M `Application`, `Resume`, and `InterviewSession`
  - `Job` 1:M `Application` (with unique compound constraint `(student_id, job_id)` preventing duplicate applications)
- Custom JPA query methods: `findByDepartment()`, `findByCgpaGreaterThanEqual()`, `findByTitleContainingIgnoreCase()`, `findByStudentId()`.

### 4. Generative AI Integration
- External LLM Integration: Google Gemini API (`gemini-1.5-flash`).
- API Key Security: Configured through `GEMINI_API_KEY` environment variable. Never exposed to frontend clients.
- Intelligent Domain Fallback Engine (`AIResponseFallbackProvider.java`): If an external key is absent or unreachable, comprehensive domain-accurate responses for ATS scoring, roadmap planning, and interview answer evaluations are served with zero interruption.

---

## 👥 Default User Roles & Credentials

For fast demonstration and grading, 1-click login buttons are provided on the login page:

| Role | Name | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **STUDENT** | Kartik Sharma | `student@campus.edu` | `Student@123` | Dashboard, Profile, ATS Scanner, Jobs, Tracker, AI Prep |
| **STUDENT** | Priya Patel | `priya.patel@campus.edu` | `Student@123` | IT Department Candidate, Placed at Google Cloud |
| **ADMIN** | Prof. Robert Vance | `admin@campus.edu` | `Admin@123` | Analytics, Job Postings, Shortlisting, Student Directory |

---

## 📂 Project Structure

```
fullstack_pro/
├── backend/
│   ├── src/main/java/com/campusplacement/
│   │   ├── ai/                      # GeminiClient, FallbackProvider
│   │   ├── config/                  # SecurityConfig, CorsConfig, SpringCoreConfig, DataInitializer
│   │   ├── controller/              # Auth, Student, Job, Application, AI, Resume, Analytics Controllers
│   │   ├── dto/                     # Strongly-typed Request/Response DTOs
│   │   ├── entity/                  # JPA Entities (User, Student, Job, Application, Resume, Skill, etc.)
│   │   ├── exception/               # GlobalExceptionHandler, Custom Exceptions
│   │   ├── repository/              # JpaRepository & Spring Data REST interfaces
│   │   ├── security/                # JwtTokenProvider, JwtAuthenticationFilter, UserPrincipal
│   │   ├── service/                 # Service Interfaces and Implementations
│   │   └── CampusPlacementApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties   # Main configuration
│   │   ├── application-h2.properties# Zero-config H2 profile
│   │   ├── application-mysql.properties# Production MySQL profile
│   │   ├── spring-core-context.xml  # Spring Core XML bean definition demo
│   │   ├── schema.sql & data.sql    # Database seeding
│   ├── pom.xml
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/              # Navbar, Sidebar, StatCard, StatusBadge, Modal, ProtectedRoute
│   │   ├── context/                 # AuthContext (JWT persistence & 1-click test login)
│   │   ├── pages/
│   │   │   ├── Login.jsx & Register.jsx
│   │   │   ├── student/             # Dashboard, Profile, ResumeAnalyzer, Jobs, Applications, Roadmap, Prep
│   │   │   └── admin/               # Dashboard, JobManagement, Applications, Students
│   │   ├── services/api.js          # Axios client with JWT request interceptors
│   │   ├── App.jsx & main.jsx
│   │   └── index.css                # Tailwind directives & modern SaaS theme styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── campus_placement_db.sql          # Standalone MySQL schema and initial seed data
├── .env.example
└── README.md
```

---

## 🚀 Step-by-Step Setup and Execution Instructions

### Prerequisites
- **Java Development Kit (JDK 17 or Java 23)**
- **Node.js (v18+ or v20+)** and **npm**
- **Maven** (A portable Maven 3.9 distribution is bundled in `.\.maven` for immediate zero-install execution)
- *(Optional)* **MySQL 8.0** if using MySQL rather than the built-in H2 profile.

---

### Step 1: Database Setup

The backend is configured to use the **in-memory H2 database** by default for instant local execution without needing to start MySQL services.

#### If you want to use MySQL:
1. Ensure your local MySQL server is running on port `3306`.
2. Open MySQL Workbench or MySQL CLI:
   ```bash
   mysql -u root -p < campus_placement_db.sql
   ```
3. Set your active profile to `mysql` in `backend/src/main/resources/application.properties`:
   ```properties
   spring.profiles.default=mysql
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   ```

---

### Step 2: Running the Spring Boot Backend

Open a terminal in the root directory:

```bash
# 1. Navigate to backend directory
cd backend

# 2. Package or Run Spring Boot
# Using the pre-built jar:
java -jar target/campus-placement-backend-1.0.0.jar

# Or using Maven:
..\.maven\bin\mvn spring-boot:run
```

The Spring Boot backend will start on **`http://localhost:8080`**.
- It initializes database tables.
- Seeds default skills, corporate jobs, and student/admin accounts.
- Outputs confirmation logs in the console.

---

### Step 3: Running the React Frontend

Open a second terminal window:

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Start the Vite development server
npm run dev
```

Open your browser and navigate to **`http://localhost:5173`**.

---

## 🧪 Functional Walkthrough & Module Verification

### Module 1: Authentication & User Roles
- Visit `http://localhost:5173/login`.
- Click **"Demo Student"** to instantly sign in as candidate Kartik Sharma.
- Alternatively, click **"Demo Admin"** to access the placement officer portal.
- Registration allows student registration with Department, Roll Number, and CGPA, or Admin registration with Employee Code.

### Module 2: Student Dashboard
- High-level metric cards: Available Jobs, Applications Sent, Shortlisted Rounds, Placement Offers.
- Profile Placement Readiness meter with direct links to complete missing sections.
- Recharts horizontal bar chart visualizing live application pipeline states.
- Recommended jobs matching the student's department and CGPA.

### Module 3: AI Resume Analyzer
- Navigate to **"AI Resume Analyzer"**.
- Drag & drop any PDF resume (or sample resume).
- Select a target role (e.g., *Full Stack Software Developer*).
- Click **"Analyze Resume Now"**:
  - Apache PDFBox extracts the raw text.
  - The AI analysis engine identifies technical skills (Java, Spring Boot, React, SQL, etc.).
  - Calculates ATS match rating (0 - 100).
  - Highlights prioritized missing skills (Docker, Kubernetes, CI/CD, Redis).
  - Supplies concrete resume bullet point suggestions.

### Module 4: Job Management & Application
- Navigate to **"Placement Jobs"**.
- Real-time search by title, company, or skill.
- Dynamic eligibility calculation: Shows **✓ Eligible** or **CGPA < 8.0** based on the student's CGPA.
- Click **"Apply"**:
  - Validates eligibility.
  - Enforces database constraint preventing duplicate submissions.
  - Updates the button state to **Applied ✓**.

### Module 5: AI Career Recommendations
- Navigate to **"AI Career Roadmap"**.
- Evaluates candidate profile and recommends top careers:
  - *Full-Stack Software Engineer*
  - *Backend & Cloud Services Engineer*
  - *AI Applications & Data Platform Engineer*
- Displays market demand and starting campus package.
- Provides a 4-week step-by-step accelerated learning roadmap with curated learning references.

### Module 6: AI Mock Interview Preparation
- Navigate to **"AI Mock Interview"**.
- Choose role and mode:
  - **Technical Interview Mode:** Generates architecture questions, reveals sample answers, and allows students to submit written answers for AI scoring (0 - 100) and actionable strengths/improvement feedback.
  - **HR Round Mode:** Scenario-based behavioral questions evaluated against the STAR method.
  - **MCQ Quiz Mode:** Placement assessment aptitude test with real-time answer checking, explanations, and score tracking.

### Module 7: Admin Placement Dashboard & Controls
- Log in as Admin (`admin@campus.edu` / `Admin@123`).
- **Admin Analytics:** Placement rate percentage, visiting company count, department-wise placement bar chart, and recruitment funnel status distribution.
- **Job Postings:** Create, edit, and delete campus job postings, set CGPA cutoffs and deadlines.
- **Student Applications:** View all submissions, update stages (`SHORTLISTED`, `TECHNICAL_ROUND`, `HR_ROUND`, `SELECTED`), schedule interview dates, and send candidate feedback.
- **Student Directory:** Inspect student CGPAs, departments, and verified technical skill tags.

---

## 📡 REST API Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new Student or Admin | Public |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | Public |
| `GET` | `/api/jobs` | Retrieve all active jobs (with eligibility flags) | Public / Student |
| `POST` | `/api/jobs` | Create new job posting | Admin (`ROLE_ADMIN`) |
| `PUT` | `/api/jobs/{id}` | Update job posting | Admin (`ROLE_ADMIN`) |
| `DELETE` | `/api/jobs/{id}` | Remove job posting | Admin (`ROLE_ADMIN`) |
| `POST` | `/api/applications` | Apply for eligible job | Student (`ROLE_STUDENT`) |
| `GET` | `/api/applications/student/{id}`| List student's submitted applications | Authenticated |
| `PUT` | `/api/applications/{id}/status` | Update stage, set interview date & notes | Admin (`ROLE_ADMIN`) |
| `POST` | `/api/resumes/upload` | Upload PDF, parse text, generate ATS report | Student (`ROLE_STUDENT`) |
| `POST` | `/api/ai/recommend-career` | Generate AI career match & learning roadmap | Authenticated |
| `POST` | `/api/ai/generate-interview` | Generate role-specific mock questions/MCQs | Authenticated |
| `POST` | `/api/ai/evaluate-answer` | AI evaluation & scoring of candidate answer | Authenticated |
| `GET` | `/api/analytics/student/{id}` | Get student dashboard placement stats | Authenticated |
| `GET` | `/api/analytics/admin` | Get college-wide placement statistics | Admin (`ROLE_ADMIN`) |
| `GET` | `/api/rest/jobs-rest` | Spring Data REST HAL+JSON endpoint | Public |

