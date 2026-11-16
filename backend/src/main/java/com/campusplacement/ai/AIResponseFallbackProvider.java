package com.campusplacement.ai;

import com.campusplacement.dto.*;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class AIResponseFallbackProvider {

    private static final Random RANDOM = new Random();

    public ResumeAnalysisDto generateResumeAnalysis(String fileName, String extractedText) {
        ResumeAnalysisDto dto = new ResumeAnalysisDto();
        dto.setFileName(fileName);
        dto.setRawExtractedText(extractedText);

        // Analyze text to extract recognized tech skills
        List<String> recognizedSkills = extractSkillsFromText(extractedText);
        if (recognizedSkills.isEmpty()) {
            recognizedSkills = Arrays.asList("Java", "Spring Boot", "React.js", "SQL", "Git", "REST APIs");
        }
        dto.setExtractedSkills(recognizedSkills);

        // Identify high-value missing skills
        List<String> missingSkills = Arrays.asList("Docker", "Kubernetes", "AWS Cloud", "CI/CD Pipelines", "System Design", "Unit Testing (JUnit/Mockito)");
        dto.setMissingSkills(missingSkills);

        int baseScore = 72 + Math.min(recognizedSkills.size() * 3, 20);
        dto.setMatchScore(Math.min(baseScore, 95));

        dto.setEducationSummary("B.Tech / B.E. in Computer Science / Information Technology with strong academic track record.");
        dto.setExperienceSummary("Relevant project portfolio showcasing full-stack application development, database modeling, and API integrations.");

        dto.setStrengths(Arrays.asList(
                "Strong foundational proficiency in core languages (" + String.join(", ", recognizedSkills.subList(0, Math.min(3, recognizedSkills.size()))) + ")",
                "Hands-on project demonstrations with modern full-stack architectures",
                "Clear academic profile and problem-solving focus"
        ));

        dto.setSuggestions(Arrays.asList(
                "Include quantifiable metrics in project bullet points (e.g., 'reduced API response latency by 35%')",
                "Add cloud deployment experience (e.g., hosting containerized apps on AWS/GCP)",
                "Enhance the resume layout with standard ATS section headings: Skills, Experience, Projects, Education",
                "Earn an industry credential such as AWS Certified Cloud Practitioner or Oracle Java Associate"
        ));

        dto.setRecommendedJobRoles(Arrays.asList(
                "Junior Full-Stack Software Engineer",
                "Backend Java Developer",
                "Cloud Application Developer",
                "Software Development Engineer in Test (SDET)"
        ));

        return dto;
    }

    public List<CareerRecommendationDto> generateCareerRecommendations(String department, Double cgpa, Set<String> currentSkills) {
        List<CareerRecommendationDto> recommendations = new ArrayList<>();

        // Role 1: Full-Stack Java & React Developer
        CareerRecommendationDto role1 = new CareerRecommendationDto();
        role1.setJobRole("Full-Stack Software Engineer");
        role1.setMatchPercentage(calculateSkillMatch(currentSkills, Arrays.asList("Java", "Spring Boot", "React", "SQL", "Git")));
        role1.setMatchedSkills(filterMatched(currentSkills, Arrays.asList("Java", "Spring Boot", "React", "JavaScript", "HTML", "CSS", "SQL", "Git")));
        role1.setMissingSkills(Arrays.asList("Docker", "Microservices Architecture", "Redis Caching", "Tailwind CSS"));
        role1.setRationale("Your solid understanding of core object-oriented programming combined with modern frontend frameworks makes you a prime candidate for enterprise full-stack roles.");
        role1.setMarketDemand("VERY_HIGH");
        role1.setAverageStartingSalary("8.5 - 14.0 LPA");
        role1.setLearningRoadmap(Arrays.asList(
                new CareerRecommendationDto.RoadmapStepDto(1, "Modern Microservices with Spring Boot 3", "2 Weeks",
                        "Master Spring Cloud Gateway, Eureka Service Discovery, and OpenFeign client communication.",
                        Arrays.asList("Spring Cloud Docs", "Baeldung Microservices Guide")),
                new CareerRecommendationDto.RoadmapStepDto(2, "Containerization with Docker & Compose", "1 Week",
                        "Containerize multi-tier Spring Boot and React applications with isolated MySQL networks.",
                        Arrays.asList("Docker Official Getting Started", "Play with Docker Labs")),
                new CareerRecommendationDto.RoadmapStepDto(3, "Enterprise Caching with Redis & Message Queues", "2 Weeks",
                        "Implement distributed caching using Redis and asynchronous messaging with RabbitMQ / Kafka.",
                        Arrays.asList("Redis University", "Spring Boot Redis Tutorials")),
                new CareerRecommendationDto.RoadmapStepDto(4, "High-Level System Design & CI/CD", "2 Weeks",
                        "Design scalable architectures, load balancers, rate limiters, and deploy automated GitHub Actions pipelines.",
                        Arrays.asList("ByteByteGo System Design", "GitHub Actions Mastery"))
        ));
        role1.setRecommendedCertifications(Arrays.asList(
                "AWS Certified Solutions Architect - Associate",
                "Spring Professional Develop Certification",
                "Meta Front-End Developer Professional Certificate"
        ));
        recommendations.add(role1);

        // Role 2: Backend & Cloud Services Engineer
        CareerRecommendationDto role2 = new CareerRecommendationDto();
        role2.setJobRole("Backend & Cloud Services Engineer");
        role2.setMatchPercentage(calculateSkillMatch(currentSkills, Arrays.asList("Java", "Python", "SQL", "REST APIs", "Database Design")));
        role2.setMatchedSkills(filterMatched(currentSkills, Arrays.asList("Java", "Python", "SQL", "Database Design", "REST APIs", "Git")));
        role2.setMissingSkills(Arrays.asList("AWS Lambda / ECS", "Kubernetes", "gRPC", "Prometheus & Grafana"));
        role2.setRationale("Your backend data modeling and core systems knowledge aligns well with enterprise cloud infrastructure and distributed microservices.");
        role2.setMarketDemand("HIGH");
        role2.setAverageStartingSalary("9.0 - 16.0 LPA");
        role2.setLearningRoadmap(Arrays.asList(
                new CareerRecommendationDto.RoadmapStepDto(1, "Advanced SQL Query Optimization & Indexing", "1.5 Weeks",
                        "Deep dive into B-Trees, execution query plans, composite indices, and database transaction isolation levels.",
                        Arrays.asList("Use The Index Luke", "High Performance MySQL")),
                new CareerRecommendationDto.RoadmapStepDto(2, "Cloud Deployment with AWS & Terraform", "2 Weeks",
                        "Provision VPCs, RDS instances, and ECS clusters using Infrastructure as Code (IaC).",
                        Arrays.asList("HashiCorp Terraform Tutorials", "AWS Skill Builder")),
                new CareerRecommendationDto.RoadmapStepDto(3, "Distributed Logging & Observability", "1.5 Weeks",
                        "Integrate Prometheus, OpenTelemetry, and Grafana for monitoring backend health and request latency.",
                        Arrays.asList("Grafana Cloud Labs", "Spring Boot Actuator & Micrometer"))
        ));
        role2.setRecommendedCertifications(Arrays.asList(
                "AWS Certified Developer - Associate",
                "Certified Kubernetes Application Developer (CKAD)"
        ));
        recommendations.add(role2);

        // Role 3: AI & Data Platform Engineer
        CareerRecommendationDto role3 = new CareerRecommendationDto();
        role3.setJobRole("AI Applications & Data Platform Engineer");
        role3.setMatchPercentage(calculateSkillMatch(currentSkills, Arrays.asList("Python", "SQL", "Java", "Machine Learning")));
        role3.setMatchedSkills(filterMatched(currentSkills, Arrays.asList("Python", "SQL", "Java", "Data Structures")));
        role3.setMissingSkills(Arrays.asList("LangChain", "Vector Databases (Pinecone/Milvus)", "PyTorch", "RAG Pipelines"));
        role3.setRationale("With the rapid adoption of GenAI, software engineers capable of integrating Large Language Models with production backend systems are in massive demand.");
        role3.setMarketDemand("VERY_HIGH");
        role3.setAverageStartingSalary("10.0 - 18.0 LPA");
        role3.setLearningRoadmap(Arrays.asList(
                new CareerRecommendationDto.RoadmapStepDto(1, "Retrieval-Augmented Generation (RAG) Architecture", "2 Weeks",
                        "Build semantic search workflows with embeddings, vector databases, and LangChain / Spring AI.",
                        Arrays.asList("DeepLearning.AI RAG Course", "Spring AI Reference Guide")),
                new CareerRecommendationDto.RoadmapStepDto(2, "Fine-Tuning & Prompt Engineering at Scale", "2 Weeks",
                        "Implement few-shot prompt chaining, evaluation benchmarks, and structured output formatting.",
                        Arrays.asList("Google Cloud Generative AI Learning Path", "OpenAI Cookbook"))
        ));
        role3.setRecommendedCertifications(Arrays.asList(
                "Google Cloud Certified - Machine Learning Engineer",
                "DeepLearning.AI Generative AI for Everyone"
        ));
        recommendations.add(role3);

        return recommendations;
    }

    public List<InterviewQuestionDto> generateInterviewQuestions(String jobRole, String category, int count) {
        List<InterviewQuestionDto> questions = new ArrayList<>();
        long id = 1L;

        if ("MCQ_QUIZ".equalsIgnoreCase(category)) {
            // MCQ Questions
            InterviewQuestionDto q1 = new InterviewQuestionDto();
            q1.setId(id++);
            q1.setIsMcq(true);
            q1.setCategory("CORE_CS");
            q1.setDifficulty("EASY");
            q1.setQuestion("In Java Spring Framework, which annotation is used to designate a class as an IoC managed service component?");
            q1.setOptions(Arrays.asList("@Controller", "@Repository", "@Service", "@Configuration"));
            q1.setCorrectOptionIndex(2);
            q1.setExplanation("@Service is a specialization of the @Component annotation used on business layer classes.");
            questions.add(q1);

            InterviewQuestionDto q2 = new InterviewQuestionDto();
            q2.setId(id++);
            q2.setIsMcq(true);
            q2.setCategory("DATABASE");
            q2.setDifficulty("MEDIUM");
            q2.setQuestion("Which ACID property ensures that transactions execute without interference from concurrent transactions?");
            q2.setOptions(Arrays.asList("Atomicity", "Consistency", "Isolation", "Durability"));
            q2.setCorrectOptionIndex(2);
            q2.setExplanation("Isolation ensures that concurrent transactions do not see intermediate or conflicting states.");
            questions.add(q2);

            InterviewQuestionDto q3 = new InterviewQuestionDto();
            q3.setId(id++);
            q3.setIsMcq(true);
            q3.setCategory("FRONTEND");
            q3.setDifficulty("MEDIUM");
            q3.setQuestion("In React 18, what hook is used to persist mutable values across renders without causing a component re-render?");
            q3.setOptions(Arrays.asList("useState", "useEffect", "useRef", "useMemo"));
            q3.setCorrectOptionIndex(2);
            q3.setExplanation("useRef returns a mutable ref object whose .current property persists without triggering re-render.");
            questions.add(q3);

            InterviewQuestionDto q4 = new InterviewQuestionDto();
            q4.setId(id++);
            q4.setIsMcq(true);
            q4.setCategory("SYSTEM_DESIGN");
            q4.setDifficulty("HARD");
            q4.setQuestion("Which HTTP status code is most appropriate when a client attempts to create an application that already exists (duplicate key)?");
            q4.setOptions(Arrays.asList("400 Bad Request", "409 Conflict", "403 Forbidden", "422 Unprocessable Entity"));
            q4.setCorrectOptionIndex(1);
            q4.setExplanation("409 Conflict indicates that the request could not be processed because of conflict in the current state of the resource.");
            questions.add(q4);

            InterviewQuestionDto q5 = new InterviewQuestionDto();
            q5.setId(id++);
            q5.setIsMcq(true);
            q5.setCategory("SECURITY");
            q5.setDifficulty("MEDIUM");
            q5.setQuestion("What algorithm family is commonly used by BCrypt for secure password hashing?");
            q5.setOptions(Arrays.asList("MD5 message-digest", "Blowfish cipher key schedule", "SHA-256 linear hashing", "RSA asymmetric key"));
            q5.setCorrectOptionIndex(1);
            q5.setExplanation("BCrypt is based on the Blowfish cipher's key setup algorithm and includes an adaptive work factor.");
            questions.add(q5);

            return questions;
        }

        if ("HR".equalsIgnoreCase(category)) {
            // HR Questions
            InterviewQuestionDto q1 = new InterviewQuestionDto();
            q1.setId(id++);
            q1.setIsMcq(false);
            q1.setCategory("HR");
            q1.setDifficulty("MEDIUM");
            q1.setQuestion("Tell me about a time when you had to handle a tight academic deadline or conflicting priorities. How did you organize your work?");
            q1.setExpectedKeyPoints(Arrays.asList(
                    "Use the STAR method (Situation, Task, Action, Result)",
                    "Explain specific prioritization techniques (e.g. Eisenhower Matrix, Kanban)",
                    "Highlight proactive communication with team members or mentors",
                    "Conclude with a positive measurable outcome"
            ));
            q1.setSampleAnswer("During our final year capstone project, our team had to deliver a functioning prototype while simultaneously preparing for semester examinations. I organized a shared sprint board, broke down deliverables into daily checkpoints, and delegated tasks according to individual strengths. By scheduling early code reviews and maintaining transparent communication, we delivered the project two days ahead of schedule and achieved an 'A' grade.");
            questions.add(q1);

            InterviewQuestionDto q2 = new InterviewQuestionDto();
            q2.setId(id++);
            q2.setIsMcq(false);
            q2.setCategory("HR");
            q2.setDifficulty("MEDIUM");
            q2.setQuestion("Why do you want to join our organization specifically, and where do you envision your career in the next 3 to 5 years?");
            q2.setExpectedKeyPoints(Arrays.asList(
                    "Show research on company products, culture, and engineering values",
                    "Align personal growth goals with the team's technical roadmap",
                    "Express enthusiasm for continuous learning and mentoring junior engineers"
            ));
            q2.setSampleAnswer("I admire your company's commitment to high-availability engineering and scalable software solutions. In the next 3 years, I plan to master cloud-native backend systems and deepen my expertise in distributed architectures. By year 5, I aim to lead critical feature designs and mentor upcoming graduate engineers.");
            questions.add(q2);

            return questions;
        }

        // Default: Technical questions
        InterviewQuestionDto q1 = new InterviewQuestionDto();
        q1.setId(id++);
        q1.setIsMcq(false);
        q1.setCategory("TECHNICAL");
        q1.setDifficulty("MEDIUM");
        q1.setQuestion("Explain how Spring Boot's Dependency Injection and ApplicationContext manage the bean lifecycle from initialization to destruction.");
        q1.setExpectedKeyPoints(Arrays.asList(
                "BeanFactory vs ApplicationContext distinction",
                "Bean definition scanning and instantiation",
                "Dependency resolution via constructor or setter injection",
                "@PostConstruct, InitializingBean (afterPropertiesSet)",
                "Bean ready state and @PreDestroy / DisposableBean destruction"
        ));
        q1.setSampleAnswer("Spring's IoC container manages objects called beans. When the ApplicationContext starts, it scans for annotations like @Component, @Service, and @Repository, instantiates beans, and resolves their dependencies—preferably via constructor injection. After instantiation, Spring injects properties, runs Aware callbacks, and executes @PostConstruct methods. During container shutdown, @PreDestroy or DisposableBean callbacks release held resources.");
        questions.add(q1);

        InterviewQuestionDto q2 = new InterviewQuestionDto();
        q2.setId(id++);
        q2.setIsMcq(false);
        q2.setCategory("TECHNICAL");
        q2.setDifficulty("HARD");
        q2.setQuestion("How would you design a rate limiter for a public REST API in a distributed campus placement system?");
        q2.setExpectedKeyPoints(Arrays.asList(
                "Algorithms: Token Bucket, Leaky Bucket, Sliding Window Log",
                "Distributed storage: Redis with atomic Lua scripts or Redis Cell",
                "HTTP headers: X-RateLimit-Limit, X-RateLimit-Remaining, 429 Too Many Requests status code",
                "Client identification by IP or JWT token"
        ));
        q2.setSampleAnswer("I would implement the Token Bucket algorithm using Redis to share state across multiple API gateway instances. Each incoming request from a student or client is identified via JWT subject or IP. A Redis Lua script atomically decrements the bucket tokens and verifies capacity. If the limit is exceeded, the server returns HTTP 429 Too Many Requests with a Retry-After header.");
        questions.add(q2);

        InterviewQuestionDto q3 = new InterviewQuestionDto();
        q3.setId(id++);
        q3.setIsMcq(false);
        q3.setCategory("TECHNICAL");
        q3.setDifficulty("MEDIUM");
        q3.setQuestion("What is the difference between Optimistic Locking and Pessimistic Locking in JPA/Hibernate? When would you use each?");
        q3.setExpectedKeyPoints(Arrays.asList(
                "Optimistic locking uses a @Version column and throws OptimisticLockException on concurrent conflict",
                "Pessimistic locking uses database locks (SELECT FOR UPDATE) to block concurrent transactions",
                "Optimistic locking is best for high-read, low-conflict environments",
                "Pessimistic locking is best for high-contention scenarios (e.g. limited job interview seat booking)"
        ));
        q3.setSampleAnswer("Optimistic locking assumes conflicts are rare. It uses a @Version column; if two transactions try to update the same record, Hibernate detects the mismatch and throws an exception. Pessimistic locking acquires a row-level lock in the database immediately, blocking other transactions until complete. For campus placements, booking an interview slot with limited capacity benefits from pessimistic locking, whereas updating student profiles is better suited for optimistic locking.");
        questions.add(q3);

        return questions;
    }

    public InterviewEvaluationResponse evaluateAnswer(String jobRole, String question, String studentAnswer, String category) {
        InterviewEvaluationResponse response = new InterviewEvaluationResponse();

        if (studentAnswer == null || studentAnswer.trim().length() < 10) {
            response.setScore(30);
            response.setRating("NEEDS_IMPROVEMENT");
            response.setStrengths(Collections.singletonList("Attempted the question."));
            response.setImprovements(Arrays.asList(
                    "Provide a more detailed and structured response.",
                    "Include concrete technical terminology and examples."
            ));
            response.setModelAnswer("A complete answer should address key concepts systematically with practical industry illustrations.");
            response.setDetailedFeedback("The answer is too brief to demonstrate full proficiency. Practice articulating the underlying architecture and practical examples.");
            return response;
        }

        int length = studentAnswer.trim().length();
        int score = Math.min(68 + (length / 25), 94);

        response.setScore(score);
        if (score >= 85) {
            response.setRating("EXCELLENT");
        } else if (score >= 75) {
            response.setRating("GOOD");
        } else {
            response.setRating("AVERAGE");
        }

        response.setStrengths(Arrays.asList(
                "Clear understanding of core concepts relating to " + jobRole,
                "Logical flow and direct addressing of the prompt",
                "Good technical vocabulary and practical perspective"
        ));

        response.setImprovements(Arrays.asList(
                "Consider mentioning edge cases, failure recovery, or concurrency considerations",
                "Reinforce your answer with quantitative results or real-world metrics from your past projects"
        ));

        response.setModelAnswer("To excel in a senior placement round, structure the answer by stating the fundamental concept, discussing the trade-offs (e.g., memory vs speed), outlining the production implementation steps, and explaining how you monitored or tested the solution.");
        response.setDetailedFeedback("Strong performance! You demonstrated good technical competence. Fine-tune your response by emphasizing production scalability and automated testing.");

        return response;
    }

    private List<String> extractSkillsFromText(String text) {
        if (text == null) return Collections.emptyList();
        String lower = text.toLowerCase();
        List<String> found = new ArrayList<>();
        String[] dictionary = {
                "Java", "Spring Boot", "React", "JavaScript", "TypeScript", "Python",
                "C++", "C#", "SQL", "MySQL", "PostgreSQL", "MongoDB", "Git",
                "Docker", "AWS", "HTML", "CSS", "REST", "Node.js", "Express",
                "Linux", "Redis", "Kafka", "Machine Learning", "Data Structures"
        };
        for (String skill : dictionary) {
            if (lower.contains(skill.toLowerCase())) {
                found.add(skill);
            }
        }
        return found;
    }

    private int calculateSkillMatch(Set<String> studentSkills, List<String> requiredSkills) {
        if (studentSkills == null || studentSkills.isEmpty()) return 60;
        long matchCount = requiredSkills.stream()
                .filter(req -> studentSkills.stream().anyMatch(s -> s.equalsIgnoreCase(req)))
                .count();
        double ratio = (double) matchCount / requiredSkills.size();
        return (int) Math.round(55 + (ratio * 40));
    }

    private List<String> filterMatched(Set<String> studentSkills, List<String> targetSkills) {
        if (studentSkills == null || studentSkills.isEmpty()) {
            return targetSkills.subList(0, Math.min(2, targetSkills.size()));
        }
        List<String> matched = new ArrayList<>();
        for (String target : targetSkills) {
            if (studentSkills.stream().anyMatch(s -> s.equalsIgnoreCase(target))) {
                matched.add(target);
            }
        }
        if (matched.isEmpty()) {
            matched.add(targetSkills.get(0));
        }
        return matched;
    }
}

