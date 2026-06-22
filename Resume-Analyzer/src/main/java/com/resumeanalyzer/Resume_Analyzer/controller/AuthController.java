package com.resumeanalyzer.Resume_Analyzer.controller;

import com.resumeanalyzer.Resume_Analyzer.dto.AuthRequest;
import com.resumeanalyzer.Resume_Analyzer.dto.AuthResponse;
import com.resumeanalyzer.Resume_Analyzer.entity.User;
import com.resumeanalyzer.Resume_Analyzer.repository.UserRepository;
import com.resumeanalyzer.Resume_Analyzer.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Check if username already exists
        if (userRepository.existsByUserName(user.getUserName())) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("message", "Username already exists"));
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("message", "Email already exists"));
        }
        
        // Hash the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Generate Tokens
        String accessToken = jwtService.generateAccessToken(user.getUserName());
        String refreshToken = jwtService.generateRefreshToken(user.getUserName());
        
        // Save tokens to DB per user request
        user.setAccessToken(accessToken);
        user.setRefreshToken(refreshToken);
        
        userRepository.save(user);
        
        return new ResponseEntity<>(new AuthResponse(user.getId(), user.getUserName(), user.getProfileImage(), user.getEmail(), accessToken, refreshToken), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            // Authenticate the user (this checks against CustomUserDetailsService which uses PasswordEncoder)
            Authentication authenticate = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUserName(), authRequest.getPassword())
            );

            // Get the actual username from the authenticated principal (in case they logged in with email)
            String actualUserName = authenticate.getName();

            String accessToken = jwtService.generateAccessToken(actualUserName);
            String refreshToken = jwtService.generateRefreshToken(actualUserName);

            // Update the user record in DB with new tokens
            User user = userRepository.findByUserName(actualUserName).orElseThrow();
            user.setAccessToken(accessToken);
            user.setRefreshToken(refreshToken);
            userRepository.save(user);

            return new ResponseEntity<>(new AuthResponse(user.getId(), user.getUserName(), user.getProfileImage(), user.getEmail(), accessToken, refreshToken), HttpStatus.OK);

        } catch (UsernameNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "No account found with that email or username."));
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Incorrect password. Please try again."));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An unexpected error occurred. Please try again."));
        }
    }
}
