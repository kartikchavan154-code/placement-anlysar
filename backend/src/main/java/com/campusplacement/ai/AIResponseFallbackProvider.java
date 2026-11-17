package com.campusplacement.ai;

import com.campusplacement.dto.*;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class AIResponseFallbackProvider {

    private static final Random RANDOM = new Random();

    public ResumeAnalysisDto generateResumeAnalysis(String fileName, String extractedText) {
        return generateResumeAnalysis(fileName, extractedText, "Full Stack Software Developer");
    }

    public ResumeAnalysisDto generateResumeAnalysis(String fileName, String extractedText, String targetJobRole) {
        if (targetJobRole == null || targetJobRole.trim().isEmpty()) {
            targetJobRole = "Full Stack Software Developer";
        }

        ResumeAnalysisDto dto = new ResumeAnalysisDto();
        dto.setFileName(fileName);
        dto.setRawExtractedText(extractedText);

        // 1. Extract technical skills present in the resume
        List<String> rawSkills = extractSkillsFromText(extractedText);
        final List<String> recognizedSkills = rawSkills.isEmpty() ? detectFallbackSkills(fileName, extractedText) : rawSkills;
        dto.setExtractedSkills(recognizedSkills);

        // 2. Identify target role skills
        List<String> coreSkills = getRequiredSkillsForRole(targetJobRole);
        List<String> secondarySkills = getSecondarySkillsForRole(targetJobRole);

        // 3. Compare extracted skills against target role
        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        for (String core : coreSkills) {
            if (hasSkill(recognizedSkills, core) || containsWord(extractedText, core)) {
                matchedSkills.add(core);
            } else {
                missingSkills.add(core);
            }
        }

        for (String sec : secondarySkills) {
            if (hasSkill(recognizedSkills, sec) || containsWord(extractedText, sec)) {
                if (!matchedSkills.contains(sec)) {
                    matchedSkills.add(sec);
                }
            } else {
                if (!missingSkills.contains(sec) && missingSkills.size() < 6) {
                    missingSkills.add(sec);
                }
            }
        }
        dto.setMissingSkills(missingSkills);

        // 4. Calculate DYNAMIC ATS Match Score (varies significantly by resume content & target role)
        double coreRatio = (double) (coreSkills.size() - countMissing(coreSkills, missingSkills)) / Math.max(1, coreSkills.size());
        int corePoints = (int) Math.round(coreRatio * 56.0); // up to 56 points

        long secondaryMatchedCount = secondarySkills.stream()
                .filter(s -> hasSkill(recognizedSkills, s) || containsWord(extractedText, s))
                .count();
        int secondaryPoints = (int) Math.min(secondaryMatchedCount * 4, 18); // up to 18 points

        int structurePoints = evaluateResumeStructure(extractedText); // up to 16 points

        // Breadth bonus (number of distinct technical skills)
        int breadthBonus = Math.min(recognizedSkills.size() * 2, 10); // up to 10 points

        int dynamicScore = corePoints + secondaryPoints + structurePoints + breadthBonus;
        // Keep in realistic bounds (38% to 96%)
        dynamicScore = Math.max(38, Math.min(dynamicScore, 96));
        dto.setMatchScore(dynamicScore);

        // 5. Dynamic Strengths
        List<String> strengths = new ArrayList<>();
        if (!matchedSkills.isEmpty()) {
            strengths.add("Strong alignment in core " + targetJobRole + " competencies: " +
                    String.join(", ", matchedSkills.subList(0, Math.min(4, matchedSkills.size()))));
        }
        if (recognizedSkills.size() >= 5) {
            strengths.add("Demonstrated technical breadth across " + recognizedSkills.size() + " developer tools and frameworks");
        }
        if (containsWord(extractedText, "project") || containsWord(extractedText, "developed") || containsWord(extractedText, "built")) {
            strengths.add("Evidence of hands-on project engineering and software delivery");
        }
        if (containsWord(extractedText, "api") || containsWord(extractedText, "rest") || containsWord(extractedText, "microservice")) {
            strengths.add("Experience building and consuming modern web services and APIs");
        }
        if (strengths.isEmpty()) {
            strengths.add("Foundational engineering background with strong aptitude for entry-level hiring");
        }
        dto.setStrengths(strengths);

        // 6. Actionable Suggestions targeted directly to missing competencies
        List<String> suggestions = new ArrayList<>();
        if (!missingSkills.isEmpty()) {
            String topMissing = String.join(", ", missingSkills.subList(0, Math.min(3, missingSkills.size())));
            suggestions.add("Bridge high-priority keyword gaps for " + targetJobRole + ": incorporate proof of " + topMissing);
        }
        suggestions.add("Include quantifiable metrics in project bullet points (e.g., 'reduced API query latency by 35%', 'handled 500+ requests/sec')");
        if (!containsWord(extractedText, "docker") && !containsWord(extractedText, "kubernetes") && !containsWord(extractedText, "aws")) {
            suggestions.add("Add containerization (Docker) or cloud hosting (AWS / Render) to showcase modern deployment readiness");
        }
        if (!containsWord(extractedText, "test") && !containsWord(extractedText, "junit")) {
            suggestions.add("Mention automated testing tools (JUnit, Mockito, or Jest) to signal clean code practices to ATS algorithms");
        }
        suggestions.add("Organize resume layout with standard ATS section headings: Summary, Technical Skills, Projects, Education");
        dto.setSuggestions(suggestions);

        // 7. Dynamic Education & Experience Summaries
        dto.setEducationSummary(extractEducationSummary(extractedText));
        dto.setExperienceSummary(extractExperienceSummary(extractedText, recognizedSkills, targetJobRole));

        // 8. Recommended roles based on candidate's actual top skills
        dto.setRecommendedJobRoles(determineBestFitRoles(recognizedSkills, targetJobRole));

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
                "C++", "C#", "C", "Go", "Kotlin", "Swift", "SQL", "MySQL", "PostgreSQL",
                "MongoDB", "Redis", "Oracle", "Git", "GitHub", "Docker", "Kubernetes",
                "AWS", "GCP", "Azure", "Linux", "HTML", "CSS", "Tailwind CSS", "Bootstrap",
                "REST", "REST APIs", "GraphQL", "Node.js", "Express", "Next.js", "Vue",
                "Angular", "Kafka", "RabbitMQ", "Microservices", "CI/CD", "Jenkins",
                "Terraform", "Machine Learning", "Deep Learning", "Pandas", "NumPy",
                "Selenium", "JUnit", "Mockito", "TestNG", "Postman", "Data Structures",
                "Algorithms", "System Design", "Agile", "Scrum", "Redux", "Hibernate", "JPA"
        };
        for (String skill : dictionary) {
            if (lower.contains(skill.toLowerCase())) {
                if (!found.contains(skill)) {
                    found.add(skill);
                }
            }
        }
        return found;
    }

    private List<String> detectFallbackSkills(String fileName, String extractedText) {
        String combined = ((fileName != null ? fileName : "") + " " + (extractedText != null ? extractedText : "")).toLowerCase();
        List<String> detected = new ArrayList<>();
        if (combined.contains("front") || combined.contains("react") || combined.contains("web")) {
            detected.addAll(Arrays.asList("React", "JavaScript", "HTML", "CSS", "Git"));
        } else if (combined.contains("data") || combined.contains("ai") || combined.contains("python")) {
            detected.addAll(Arrays.asList("Python", "SQL", "Data Structures", "Git", "Machine Learning"));
        } else {
            detected.addAll(Arrays.asList("Java", "SQL", "Data Structures", "Git", "OOP"));
        }
        return detected;
    }

    private List<String> getRequiredSkillsForRole(String role) {
        if (role == null) role = "Full Stack Software Developer";
        String r = role.toLowerCase();
        if (r.contains("front") || r.contains("react")) {
            return Arrays.asList("React", "JavaScript", "HTML", "CSS", "TypeScript", "Git");
        } else if (r.contains("back") || r.contains("java")) {
            return Arrays.asList("Java", "Spring Boot", "SQL", "REST", "Git", "Database Design");
        } else if (r.contains("cloud") || r.contains("devops")) {
            return Arrays.asList("Docker", "Kubernetes", "AWS", "Linux", "CI/CD", "Git");
        } else if (r.contains("data") || r.contains("machine") || r.contains("ml") || r.contains("ai")) {
            return Arrays.asList("Python", "SQL", "Machine Learning", "Data Structures", "Git");
        } else if (r.contains("test") || r.contains("sdet") || r.contains("qa")) {
            return Arrays.asList("Java", "Selenium", "JUnit", "SQL", "Git", "Postman");
        } else {
            return Arrays.asList("Java", "Spring Boot", "React", "JavaScript", "SQL", "Git", "REST");
        }
    }

    private List<String> getSecondarySkillsForRole(String role) {
        if (role == null) role = "Full Stack Software Developer";
        String r = role.toLowerCase();
        if (r.contains("front") || r.contains("react")) {
            return Arrays.asList("Tailwind CSS", "Redux", "Next.js", "REST APIs", "Bootstrap", "Jest");
        } else if (r.contains("back") || r.contains("java")) {
            return Arrays.asList("Microservices", "Hibernate", "JPA", "Docker", "PostgreSQL", "Redis", "Kafka");
        } else if (r.contains("cloud") || r.contains("devops")) {
            return Arrays.asList("Terraform", "Python", "GCP", "Azure", "Jenkins", "Ansible", "Prometheus");
        } else if (r.contains("data") || r.contains("machine") || r.contains("ml") || r.contains("ai")) {
            return Arrays.asList("Pandas", "NumPy", "Deep Learning", "TensorFlow", "PyTorch", "Big Data");
        } else if (r.contains("test") || r.contains("sdet") || r.contains("qa")) {
            return Arrays.asList("TestNG", "Mockito", "Cucumber", "CI/CD", "Rest Assured", "Cypress");
        } else {
            return Arrays.asList("Docker", "HTML", "CSS", "Tailwind CSS", "Microservices", "PostgreSQL", "Redis");
        }
    }

    private boolean hasSkill(List<String> list, String skill) {
        if (list == null || skill == null) return false;
        String s = skill.toLowerCase();
        return list.stream().anyMatch(item -> item.toLowerCase().equals(s) || item.toLowerCase().contains(s) || s.contains(item.toLowerCase()));
    }

    private boolean containsWord(String text, String word) {
        if (text == null || word == null) return false;
        return text.toLowerCase().contains(word.toLowerCase());
    }

    private int countMissing(List<String> required, List<String> missing) {
        int count = 0;
        for (String req : required) {
            if (missing.stream().anyMatch(m -> m.equalsIgnoreCase(req))) {
                count++;
            }
        }
        return count;
    }

    private int evaluateResumeStructure(String text) {
        if (text == null || text.trim().isEmpty()) return 6;
        int pts = 6;
        String lower = text.toLowerCase();
        if (lower.contains("education") || lower.contains("academic") || lower.contains("b.tech") || lower.contains("degree")) pts += 3;
        if (lower.contains("project") || lower.contains("experience") || lower.contains("developed") || lower.contains("built")) pts += 4;
        if (lower.contains("skill") || lower.contains("technologies") || lower.contains("tools")) pts += 3;
        return Math.min(pts, 16);
    }

    private String extractEducationSummary(String text) {
        if (text != null) {
            String lower = text.toLowerCase();
            if (lower.contains("computer science") || lower.contains("cse")) {
                return "B.Tech / B.E. in Computer Science & Engineering with strong academic foundation.";
            } else if (lower.contains("information technology") || lower.contains("it")) {
                return "B.Tech / B.E. in Information Technology with demonstrated coursework in software systems.";
            } else if (lower.contains("electronics") || lower.contains("ece")) {
                return "B.Tech in Electronics & Communication Engineering with demonstrated software computing skills.";
            }
        }
        return "Bachelor of Technology / Engineering in Software Engineering discipline.";
    }

    private String extractExperienceSummary(String text, List<String> skills, String targetRole) {
        int skillCount = skills != null ? skills.size() : 0;
        return "Demonstrated portfolio featuring " + skillCount + " technical proficiencies. Applied skills to build functional academic and self-directed projects targeted at " + targetRole + " roles.";
    }

    private List<String> determineBestFitRoles(List<String> recognizedSkills, String currentTarget) {
        List<String> roles = new ArrayList<>();
        roles.add(currentTarget);
        boolean hasJava = hasSkill(recognizedSkills, "Java");
        boolean hasReact = hasSkill(recognizedSkills, "React");
        boolean hasPython = hasSkill(recognizedSkills, "Python");
        boolean hasCloud = hasSkill(recognizedSkills, "Docker") || hasSkill(recognizedSkills, "AWS");

        if (hasJava && !roles.contains("Backend Java Developer")) roles.add("Backend Java Developer");
        if (hasReact && !roles.contains("Frontend React Developer")) roles.add("Frontend React Developer");
        if (hasPython && !roles.contains("Data & Machine Learning Engineer")) roles.add("Data & Machine Learning Engineer");
        if (hasCloud && !roles.contains("Cloud & DevOps Engineer")) roles.add("Cloud & DevOps Engineer");
        if (!roles.contains("Junior Full-Stack Software Engineer")) roles.add("Junior Full-Stack Software Engineer");

        return roles.subList(0, Math.min(4, roles.size()));
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

