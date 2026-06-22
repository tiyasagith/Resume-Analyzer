package com.resumeanalyzer.Resume_Analyzer.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO for profile update requests.
 * Email is intentionally excluded — it is not editable after registration.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    private String userName;
    private String profileImage;
}
