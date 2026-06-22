package com.resumeanalyzer.Resume_Analyzer.controller;

import com.resumeanalyzer.Resume_Analyzer.dto.ProfileResponse;
import com.resumeanalyzer.Resume_Analyzer.dto.ProfileUpdateRequest;
import com.resumeanalyzer.Resume_Analyzer.entity.User;
import com.resumeanalyzer.Resume_Analyzer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * Dedicated controller for user profile management.
 * <p>
 * Rules enforced here:
 *  - Email is READ-ONLY — it can be viewed but never changed through this endpoint.
 *  - Only userName and profileImage are updatable.
 */
@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    // ─── GET /api/profile/{userId} ───────────────────────────────────────────────
    /**
     * Fetch the public profile of a user.
     * Returns id, userName, email, and profileImage — never password or tokens.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable UUID userId) {
        return userRepository.findById(userId)
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(
                        new ProfileResponse(
                                user.getId(),
                                user.getUserName(),
                                user.getEmail(),
                                user.getProfileImage()
                        )
                ))
                .orElse(ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found")));
    }

    // ─── PUT /api/profile/{userId} ───────────────────────────────────────────────
    /**
     * Update editable profile fields: userName and profileImage.
     * Email is intentionally excluded from the request body — it cannot be changed.
     *
     * If the new userName is already taken by a DIFFERENT user, a 409 Conflict is returned.
     */
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable UUID userId,
            @RequestBody ProfileUpdateRequest request) {

        return userRepository.findById(userId)
                .<ResponseEntity<?>>map(user -> {

                    // Username uniqueness check (skip if same user keeps their own username)
                    if (request.getUserName() != null
                            && !request.getUserName().equals(user.getUserName())) {
                        boolean usernameTaken = userRepository.existsByUserName(request.getUserName());
                        if (usernameTaken) {
                            return ResponseEntity
                                    .status(HttpStatus.CONFLICT)
                                    .body(Map.of("message", "Username is already taken"));
                        }
                        user.setUserName(request.getUserName());
                    }

                    // Update profile image if provided
                    if (request.getProfileImage() != null && !request.getProfileImage().isBlank()) {
                        user.setProfileImage(request.getProfileImage());
                    }

                    // Email is deliberately NOT updated here — it is non-editable

                    User saved = userRepository.save(user);
                    return ResponseEntity.ok(
                            new ProfileResponse(
                                    saved.getId(),
                                    saved.getUserName(),
                                    saved.getEmail(),
                                    saved.getProfileImage()
                            )
                    );
                })
                .orElse(ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found")));
    }
}
