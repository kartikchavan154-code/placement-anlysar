package com.campusplacement.service;

import com.campusplacement.dto.ResumeAnalysisDto;
import org.springframework.web.multipart.MultipartFile;

public interface ResumeService {
    ResumeAnalysisDto uploadAndAnalyzeResume(Long studentId, MultipartFile file, String targetJobRole);
    ResumeAnalysisDto getLatestAnalysis(Long studentId);
    ResumeAnalysisDto getLatestAnalysis(Long studentId, String targetJobRole);
}

