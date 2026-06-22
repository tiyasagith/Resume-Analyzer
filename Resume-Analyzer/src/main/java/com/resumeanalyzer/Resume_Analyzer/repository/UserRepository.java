package com.resumeanalyzer.Resume_Analyzer.repository;

import com.resumeanalyzer.Resume_Analyzer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUserName(String userName);
    Optional<User> findByUserNameOrEmail(String userName, String email);
    
    boolean existsByUserName(String userName);
    boolean existsByEmail(String email);
}
