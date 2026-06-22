package com.resumeanalyzer.Resume_Analyzer.service;

import com.resumeanalyzer.Resume_Analyzer.entity.User;
import com.resumeanalyzer.Resume_Analyzer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    public User updateUser(UUID id, User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setUserName(userDetails.getUserName() != null ? userDetails.getUserName() : user.getUserName());
            user.setEmail(userDetails.getEmail() != null ? userDetails.getEmail() : user.getEmail());
            user.setPassword(userDetails.getPassword() != null ? userDetails.getPassword() : user.getPassword());
            user.setAccessToken(userDetails.getAccessToken() != null ? userDetails.getAccessToken() : user.getAccessToken());
            user.setRefreshToken(userDetails.getRefreshToken() != null ? userDetails.getRefreshToken() : user.getRefreshToken());
            user.setProfileImage(userDetails.getProfileImage() != null ? userDetails.getProfileImage() : user.getProfileImage());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }
}
