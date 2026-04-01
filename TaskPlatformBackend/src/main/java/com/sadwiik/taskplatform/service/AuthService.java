package com.sadwiik.taskplatform.service;

import com.sadwiik.taskplatform.model.User;
import com.sadwiik.taskplatform.model.enums.AccountStatus;
import com.sadwiik.taskplatform.repository.UserRepository;
import com.sadwiik.taskplatform.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Value("${admin.registration.secret}")
    private String adminRegistrationSecret;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public String register(String email, String password, String role, String adminSecret) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already in use");
        }

        String normalizedRole = role.toUpperCase();

        if ("ADMIN".equals(normalizedRole)) {
            if (adminSecret == null || !adminSecret.equals(adminRegistrationSecret)) {
                throw new RuntimeException("Invalid admin registration secret");
            }
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(normalizedRole);
        
        userRepository.save(user);
        return "User registered successfully";
    }

    public Map<String, Object> login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();
        if (AccountStatus.SUSPENDED.equals(user.getStatus())) {
            throw new RuntimeException("Your account has been suspended");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtils.generateJwtToken(user.getEmail(), user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole());

        response.put("user", userData);

        return response;
    }
}
