package com.sadwiik.taskplatform.controller;

import com.sadwiik.taskplatform.dto.RegisterRequest;
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

    @Autowired
    private com.sadwiik.taskplatform.repository.UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(java.security.Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
            }
            User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (com.sadwiik.taskplatform.model.enums.AccountStatus.SUSPENDED.equals(user.getStatus()) || 
                com.sadwiik.taskplatform.model.enums.AccountStatus.CLOSED.equals(user.getStatus())) {
               return ResponseEntity.status(403).body(Map.of("message", "Account suspended"));
            }
            
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            String result = authService.register(
                request.getEmail(), request.getPassword(),
                request.getRole(), request.getAdminSecret()
            );
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