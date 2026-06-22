package com.resumeanalyzer.Resume_Analyzer.service;

import com.resumeanalyzer.Resume_Analyzer.dto.ResumeAnalysisRequest;
import com.resumeanalyzer.Resume_Analyzer.entity.ResumeAnalysis;
import com.resumeanalyzer.Resume_Analyzer.repository.ResumeAnalysisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ResumeAnalysisService {
    
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    
    public ResumeAnalysis saveAnalysis(ResumeAnalysisRequest request) {
        log.info("Saving resume analysis for user: {}, company: {}, job: {}", 
                request.getUserId(), request.getCompanyName(), request.getJobTitle());
        
        ResumeAnalysis analysis = ResumeAnalysis.builder()
                .userId(request.getUserId())
                .companyName(request.getCompanyName())
                .jobTitle(request.getJobTitle())
                .jobDescription(request.getJobDescription())
                .resumeText(request.getResumeText())
                .fileName(request.getFileData().getName())
                .fileSize(request.getFileData().getSize())
                .fileType(request.getFileData().getType())
                .fileUrl(request.getFileData().getUrl())
                .fileId(request.getFileData().getFileId())
                .analysisResult(request.getAnalysisResult())
                .overallScore(extractOverallScore(request.getAnalysisResult()))
                .build();
        
        ResumeAnalysis savedAnalysis = resumeAnalysisRepository.save(analysis);
        log.info("Resume analysis saved with ID: {}", savedAnalysis.getId());
        
        return savedAnalysis;
    }
    
    @Transactional(readOnly = true)
    public List<ResumeAnalysis> getUserAnalyses(String userId) {
        log.debug("Fetching analyses for user: {}", userId);
        return resumeAnalysisRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    @Transactional(readOnly = true)
    public List<ResumeAnalysis> getUserAnalyses(String userId, int page, int size, String sortBy, 
            String sortDir, String startDate, String endDate, Integer minScore, Integer maxScore, 
            Boolean includeDetails, Boolean includeSuggestions) {
        log.debug("Fetching filtered analyses for user: {} with pagination and filters", userId);
        
        // For now, delegate to the simple method and ignore filtering parameters
        // TODO: Implement proper filtering and pagination in repository
        List<ResumeAnalysis> allAnalyses = resumeAnalysisRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        // Apply simple pagination
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, allAnalyses.size());
        
        if (startIndex >= allAnalyses.size()) {
            return List.of();
        }
        
        return allAnalyses.subList(startIndex, endIndex);
    }
    
    @Transactional(readOnly = true)
    public Optional<ResumeAnalysis> getAnalysisById(UUID id, String userId) {
        log.debug("Fetching analysis with ID: {} for user: {}", id, userId);
        return resumeAnalysisRepository.findById(id)
                .filter(analysis -> analysis.getUserId().equals(userId));
    }
    
    @Transactional(readOnly = true)
    public Optional<ResumeAnalysis> getAnalysisById(UUID id, String userId, 
            Boolean includeSuggestions, Boolean includeRawData, String format, Boolean includeMetadata) {
        log.debug("Fetching analysis with ID: {} for user: {} with options: suggestions={}, rawData={}, format={}, metadata={}", 
                id, userId, includeSuggestions, includeRawData, format, includeMetadata);
        return resumeAnalysisRepository.findById(id)
                .filter(analysis -> analysis.getUserId().equals(userId));
    }
    
    @Transactional(readOnly = true)
    public Optional<ResumeAnalysis> getAnalysisByFileId(String fileId, String userId) {
        log.debug("Fetching analysis with file ID: {} for user: {}", fileId, userId);
        return resumeAnalysisRepository.findByUserIdAndFileId(userId, fileId);
    }
    
    @Transactional(readOnly = true)
    public Optional<ResumeAnalysis> getAnalysisByFileId(String fileId, String userId, 
            Boolean includeSuggestions, Boolean includeRawData, String format, Boolean includeMetadata) {
        log.debug("Fetching analysis with file ID: {} for user: {} with options: suggestions={}, rawData={}, format={}, metadata={}", 
                fileId, userId, includeSuggestions, includeRawData, format, includeMetadata);
        return resumeAnalysisRepository.findByUserIdAndFileId(userId, fileId);
    }
    
    public boolean deleteAnalysis(UUID id, String userId) {
        log.info("Attempting to delete analysis with ID: {} for user: {}", id, userId);
        
        return resumeAnalysisRepository.findById(id)
                .filter(analysis -> analysis.getUserId().equals(userId))
                .map(analysis -> {
                    resumeAnalysisRepository.delete(analysis);
                    log.info("Successfully deleted analysis with ID: {}", id);
                    return true;
                })
                .orElse(false);
    }
    
    public boolean deleteAnalysis(UUID id, String userId, Boolean softDelete, String reason, Boolean forceDelete) {
        log.info("Attempting to delete analysis with ID: {} for user: {} (softDelete: {}, reason: {}, forceDelete: {})", 
                id, userId, softDelete, reason, forceDelete);
        
        return resumeAnalysisRepository.findById(id)
                .filter(analysis -> analysis.getUserId().equals(userId))
                .map(analysis -> {
                    if (softDelete != null && softDelete) {
                        // Soft delete logic - you might want to add a deleted flag or status field
                        log.info("Soft deleting analysis with ID: {}, reason: {}", id, reason);
                        // For now, we'll implement as regular delete since there's no soft delete field
                        resumeAnalysisRepository.delete(analysis);
                    } else {
                        // Hard delete
                        if (forceDelete != null && forceDelete) {
                            log.info("Force deleting analysis with ID: {}", id);
                        } else {
                            log.info("Permanently deleting analysis with ID: {}", id);
                        }
                        resumeAnalysisRepository.delete(analysis);
                    }
                    log.info("Successfully deleted analysis with ID: {}", id);
                    return true;
                })
                .orElse(false);
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getUserStatistics(String userId) {
        log.debug("Fetching statistics for user: {}", userId);
        
        List<ResumeAnalysis> analyses = getUserAnalyses(userId);
        Long totalAnalyses = resumeAnalysisRepository.countByUserId(userId);
        Double averageScore = resumeAnalysisRepository.getAverageScoreByUserId(userId);
        
        return Map.of(
                "totalAnalyses", totalAnalyses != null ? totalAnalyses : 0,
                "averageScore", averageScore != null ? averageScore : 0.0,
                "recentAnalyses", analyses.stream().limit(5).map(this::convertToSummary).toList()
        );
    }
    
    private Integer extractOverallScore(Map<String, Object> analysisResult) {
        if (analysisResult != null && analysisResult.containsKey("overall_score")) {
            Object score = analysisResult.get("overall_score");
            if (score instanceof Number) {
                return ((Number) score).intValue();
            }
        }
        return 0;
    }
    
    private Map<String, Object> convertToSummary(ResumeAnalysis analysis) {
        return Map.of(
                "id", analysis.getId(),
                "companyName", analysis.getCompanyName(),
                "jobTitle", analysis.getJobTitle(),
                "overallScore", analysis.getOverallScore(),
                "fileName", analysis.getFileName(),
                "createdAt", analysis.getCreatedAt()
        );
    }
}
