package com.campusplacement.service.impl;

import com.campusplacement.dto.ResumeAnalysisDto;
import com.campusplacement.entity.Resume;
import com.campusplacement.entity.Skill;
import com.campusplacement.entity.Student;
import com.campusplacement.exception.BadRequestException;
import com.campusplacement.exception.ResourceNotFoundException;
import com.campusplacement.repository.ResumeRepository;
import com.campusplacement.repository.SkillRepository;
import com.campusplacement.repository.StudentRepository;
import com.campusplacement.service.AIService;
import com.campusplacement.service.ResumeService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashSet;
import java.util.Optional;
import java.util.UUID;

@Service
public class ResumeServiceImpl implements ResumeService {

    private static final Logger logger = LoggerFactory.getLogger(ResumeServiceImpl.class);

    @Value("${app.upload.dir:./uploads/resumes}")
    private String uploadDir;

    private final ResumeRepository resumeRepository;
    private final StudentRepository studentRepository;
    private final SkillRepository skillRepository;
    private final AIService aiService;

    // Constructor-based Dependency Injection (Spring Core)
    public ResumeServiceImpl(ResumeRepository resumeRepository,
                             StudentRepository studentRepository,
                             SkillRepository skillRepository,
                             AIService aiService) {
        this.resumeRepository = resumeRepository;
        this.studentRepository = studentRepository;
        this.skillRepository = skillRepository;
        this.aiService = aiService;
    }

    @Override
    @Transactional
    public ResumeAnalysisDto uploadAndAnalyzeResume(Long studentId, MultipartFile file, String targetJobRole) {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file is empty");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        String originalFileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf";
        if (!originalFileName.toLowerCase().endsWith(".pdf")) {
            throw new BadRequestException("Only PDF format resumes are supported");
        }

        try {
            // Secure private storage
            Path storagePath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(storagePath);

            String secureFileName = UUID.randomUUID() + "_" + originalFileName.replaceAll("[^a-zA-Z0-9.-]", "_");
            Path targetLocation = storagePath.resolve(secureFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Extract text from PDF using Apache PDFBox
            String extractedText = "";
            try (InputStream is = file.getInputStream(); PDDocument document = PDDocument.load(is)) {
                if (!document.isEncrypted()) {
                    PDFTextStripper stripper = new PDFTextStripper();
                    extractedText = stripper.getText(document);
                } else {
                    logger.warn("PDF is encrypted; proceeding with filename text extraction.");
                }
            } catch (Exception pdfEx) {
                logger.warn("PDFBox extraction encountered note: {}. Proceeding with standard analysis.", pdfEx.getMessage());
            }

            if (extractedText.trim().isEmpty()) {
                extractedText = "Candidate Resume for " + student.getUser().getFullName() + " - Department of " + student.getDepartment();
            }

            // AI Resume Analysis
            ResumeAnalysisDto analysisDto = aiService.analyzeResume(originalFileName, extractedText, targetJobRole);

            // Save Resume record to database
            Resume resume = new Resume();
            resume.setStudent(student);
            resume.setFileName(originalFileName);
            resume.setFilePath(targetLocation.toString());
            resume.setFileType(file.getContentType());
            resume.setFileSize(file.getSize());
            resume.setEducationSummary(analysisDto.getEducationSummary());
            resume.setExperienceSummary(analysisDto.getExperienceSummary());
            resume.setRawExtractedText(extractedText);
            if (analysisDto.getExtractedSkills() != null) {
                resume.setParsedSkills(String.join(", ", analysisDto.getExtractedSkills()));
            }
            resumeRepository.save(resume);

            // Update student's resume URL and sync extracted skills
            student.setResumeUrl("/api/resumes/download/" + resume.getId());
            if (analysisDto.getExtractedSkills() != null && !analysisDto.getExtractedSkills().isEmpty()) {
                if (student.getSkills() == null) {
                    student.setSkills(new HashSet<>());
                }
                for (String skillName : analysisDto.getExtractedSkills()) {
                    Skill skill = skillRepository.findByNameIgnoreCase(skillName)
                            .orElseGet(() -> skillRepository.save(new Skill(skillName, "TECHNICAL")));
                    student.getSkills().add(skill);
                }
            }
            studentRepository.save(student);

            return analysisDto;

        } catch (BadRequestException e) {
            throw e;
        } catch (Exception ex) {
            logger.error("Failed to store and parse resume: ", ex);
            throw new RuntimeException("Could not process resume: " + ex.getMessage());
        }
    }

    @Override
    public ResumeAnalysisDto getLatestAnalysis(Long studentId) {
        Optional<Resume> resumeOpt = resumeRepository.findFirstByStudentIdOrderByUploadedAtDesc(studentId);
        if (resumeOpt.isEmpty()) {
            return null;
        }
        Resume resume = resumeOpt.get();
        return aiService.analyzeResume(resume.getFileName(), resume.getRawExtractedText(), null);
    }
}

