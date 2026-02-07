package com.sadwiik.taskplatform.controller;

import com.sadwiik.taskplatform.model.Performance;
import com.sadwiik.taskplatform.service.PerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/performance")
public class PerformanceController {

    @Autowired
    private PerformanceService performanceService;

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<Performance> getFreelancerPerformance(@PathVariable Long freelancerId) {
        try {
            Performance performance = performanceService.calculateFreelancerPerformance(freelancerId);
            return ResponseEntity.ok(performance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<Performance> getClientPerformance(@PathVariable Long clientId) {
        try {
            Performance performance = performanceService.calculateClientPerformance(clientId);
            return ResponseEntity.ok(performance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/update-score/approve/{milestoneId}")
    public ResponseEntity<String> updateScoreAfterApproval(@PathVariable Long milestoneId) {
        try {
            performanceService.updateScoreAfterApproval(milestoneId);
            return ResponseEntity.ok("Performance score updated after approval for milestone: " + milestoneId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/update-score/reject/{milestoneId}")
    public ResponseEntity<String> updateScoreAfterRejection(@PathVariable Long milestoneId) {
        try {
            performanceService.updateScoreAfterRejection(milestoneId);
            return ResponseEntity.ok("Performance score updated after rejection for milestone: " + milestoneId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
