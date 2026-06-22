package com.resumeanalyzer.Resume_Analyzer.repository;

import com.resumeanalyzer.Resume_Analyzer.entity.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, UUID> {
    
    List<ResumeAnalysis> findByUserIdOrderByCreatedAtDesc(String userId);
    
    Optional<ResumeAnalysis> findByUserIdAndFileId(String userId, String fileId);
    
    @Query("SELECT r FROM ResumeAnalysis r WHERE r.userId = :userId ORDER BY r.createdAt DESC")
    List<ResumeAnalysis> findRecentAnalysesByUserId(@Param("userId") String userId);
    
    @Query("SELECT COUNT(r) FROM ResumeAnalysis r WHERE r.userId = :userId")
    Long countByUserId(@Param("userId") String userId);
    
    @Query("SELECT AVG(r.overallScore) FROM ResumeAnalysis r WHERE r.userId = :userId")
    Double getAverageScoreByUserId(@Param("userId") String userId);
}
