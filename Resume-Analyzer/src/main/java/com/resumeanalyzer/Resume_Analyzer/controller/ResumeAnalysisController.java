package com.resumeanalyzer.Resume_Analyzer.controller;

import com.resumeanalyzer.Resume_Analyzer.dto.ResumeAnalysisRequest;
import com.resumeanalyzer.Resume_Analyzer.entity.ResumeAnalysis;
import com.resumeanalyzer.Resume_Analyzer.service.ResumeAnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/resume-analysis")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class ResumeAnalysisController {
    
    private final ResumeAnalysisService resumeAnalysisService;
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> saveAnalysis(@Valid @RequestBody ResumeAnalysisRequest request) {
        try {
            log.info("Received request to save resume analysis for user: {}", request.getUserId());
            
            ResumeAnalysis savedAnalysis = resumeAnalysisService.saveAnalysis(request);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "success", true,
                            "message", "Resume analysis saved successfully",
                            "data", Map.of(
                                    "id", savedAnalysis.getId(),
                                    "overallScore", savedAnalysis.getOverallScore(),
                                    "createdAt", savedAnalysis.getCreatedAt()
                            )
                    ));
        } catch (Exception e) {
            log.error("Error saving resume analysis: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Failed to save resume analysis: " + e.getMessage()
                    ));
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserAnalyses(@PathVariable String userId) {
        try {
            log.debug("Fetching analyses for user: {}", userId);
            
            List<ResumeAnalysis> analyses = resumeAnalysisService.getUserAnalyses(userId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", analyses
            ));
        } catch (Exception e) {
            log.error("Error fetching user analyses: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Failed to fetch analyses: " + e.getMessage()
                    ));
        }
    }
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAnalysisById(
            @RequestParam UUID id,
            @RequestParam String userId) {
        try {
            log.debug("Fetching analysis with ID: {} for user: {}", id, userId);
            
            Optional<ResumeAnalysis> analysis = resumeAnalysisService.getAnalysisById(id, userId);
            
            if (analysis.isPresent()) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "data", analysis.get()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "success", false,
                                "message", "Analysis not found"
                        ));
            }
        } catch (Exception e) {
            log.error("Error fetching analysis: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Failed to fetch analysis: " + e.getMessage()
                    ));
        }
    }
    
    @GetMapping("/file/{fileId}")
    public ResponseEntity<Map<String, Object>> getAnalysisByFileId(
            @PathVariable String fileId,
            @RequestParam String userId) {
        try {
            log.debug("Fetching analysis with file ID: {} for user: {}", fileId, userId);
            
            Optional<ResumeAnalysis> analysis = resumeAnalysisService.getAnalysisByFileId(fileId, userId);
            
            if (analysis.isPresent()) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "data", analysis.get()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "success", false,
                                "message", "Analysis not found"
                        ));
            }
        } catch (Exception e) {
            log.error("Error fetching analysis by file ID: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Failed to fetch analysis: " + e.getMessage()
                    ));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteAnalysis(
            @PathVariable UUID id,
            @RequestParam String userId) {
        try {
            log.info("Attempting to delete analysis with ID: {} for user: {}", id, userId);
            
            boolean deleted = resumeAnalysisService.deleteAnalysis(id, userId);
            
            if (deleted) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Analysis deleted successfully"
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "success", false,
                                "message", "Analysis not found or access denied"
                        ));
            }
        } catch (Exception e) {
            log.error("Error deleting analysis: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Failed to delete analysis: " + e.getMessage()
                    ));
        }
    }
    
    @GetMapping("/statistics/{userId}")
    public ResponseEntity<Map<String, Object>> getUserStatistics(@PathVariable String userId) {
        try {
            log.debug("Fetching statistics for user: {}", userId);
            
            Map<String, Object> statistics = resumeAnalysisService.getUserStatistics(userId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", statistics
            ));
        } catch (Exception e) {
            log.error("Error fetching user statistics: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Failed to fetch statistics: " + e.getMessage()
                    ));
        }
    }
}
