package com.resumeanalyzer.Resume_Analyzer.controller;

import com.resumeanalyzer.Resume_Analyzer.entity.User;
import com.resumeanalyzer.Resume_Analyzer.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Allow requests from any origin for basic testing
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }



    // READ all users or a single user by ID (?userId=1)
    @GetMapping
    public ResponseEntity<?> getUsers(@RequestParam(value = "userId", required = false) UUID userId) {
        if (userId != null) {
            return userService.getUserById(userId)
                    .map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } else {
            List<User> users = userService.getAllUsers();
            return new ResponseEntity<>(users, HttpStatus.OK);
        }
    }

    // UPDATE an existing user
    @PutMapping
    public ResponseEntity<User> updateUser(@RequestParam UUID userId, @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(userId, user);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // DELETE a user
    @DeleteMapping
    public ResponseEntity<Void> deleteUser(@RequestParam UUID userId) {
        try {
            userService.deleteUser(userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
