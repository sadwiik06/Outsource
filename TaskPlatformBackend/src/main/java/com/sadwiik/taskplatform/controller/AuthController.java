package com.sadwiik.taskplatform.controller;

import com.sadwiik.taskplatform.service.AuthService;
import com.sadwiik.taskplatform.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            String result = authService.register(user.getEmail(), user.getPassword(), user.getRole());
            Map<String, String> response = new HashMap<>();
            response.put("message", result);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            Map<String, Object> loginResponse = authService.login(user.getEmail(), user.getPassword());
            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(401).body(error);
        }
    }
}