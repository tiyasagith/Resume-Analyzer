package com.resumeanalyzer.Resume_Analyzer.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "resume_analyses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeAnalysis {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String userId;
    
    @Column(nullable = false)
    private String companyName;
    
    @Column(nullable = false)
    private String jobTitle;
    
    @Column(columnDefinition = "TEXT")
    private String jobDescription;
    
    @Column(columnDefinition = "TEXT")
    private String resumeText;
    
    @Column(nullable = false)
    private String fileName;
    
    @Column(nullable = false)
    private Long fileSize;
    
    @Column(nullable = false)
    private String fileType;
    
    @Column(nullable = false)
    private String fileUrl;
    
    @Column(nullable = false, unique = true)
    private String fileId;
    
    @Column(nullable = false)
    private Integer overallScore;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> analysisResult;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
