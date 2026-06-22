package com.resumeanalyzer.Resume_Analyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private UUID id;
    private String userName;
    private String profileImage;
    private String email;
    private String accessToken;
    private String refreshToken;
}
