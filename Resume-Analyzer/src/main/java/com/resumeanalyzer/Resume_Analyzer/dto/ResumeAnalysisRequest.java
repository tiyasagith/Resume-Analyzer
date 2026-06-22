package com.resumeanalyzer.Resume_Analyzer.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeAnalysisRequest {
    
    @NotBlank(message = "Company name is required")
    private String companyName;
    
    @NotBlank(message = "Job title is required")
    private String jobTitle;
    
    @NotBlank(message = "Job description is required")
    private String jobDescription;
    
    @NotBlank(message = "User ID is required")
    private String userId;
    
    @NotBlank(message = "Resume text is required")
    private String resumeText;
    
    @NotNull(message = "File data is required")
    private FileData fileData;
    
    @NotNull(message = "Analysis result is required")
    private Map<String, Object> analysisResult;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FileData {
        @NotBlank(message = "File name is required")
        private String name;
        
        @NotNull(message = "File size is required")
        private Long size;
        
        @NotBlank(message = "File type is required")
        private String type;
        
        @NotBlank(message = "File URL is required")
        private String url;
        
        @NotBlank(message = "File ID is required")
        private String fileId;
    }
}
