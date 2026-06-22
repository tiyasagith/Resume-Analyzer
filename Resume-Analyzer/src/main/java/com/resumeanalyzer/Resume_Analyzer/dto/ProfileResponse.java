package com.resumeanalyzer.Resume_Analyzer.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.UUID;

/**
 * DTO returned from the profile endpoint.
 * Password, accessToken, and refreshToken are intentionally omitted for security.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private UUID id;
    private String userName;
    private String email;
    private String profileImage;
}
