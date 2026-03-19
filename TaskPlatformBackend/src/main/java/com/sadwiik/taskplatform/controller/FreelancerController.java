package com.sadwiik.taskplatform.controller;

import com.sadwiik.taskplatform.dto.SubmitMilestoneRequest;
import com.sadwiik.taskplatform.model.Milestone;
import com.sadwiik.taskplatform.model.Performance;
import com.sadwiik.taskplatform.model.Task;
import com.sadwiik.taskplatform.model.User;
import com.sadwiik.taskplatform.service.FreelancerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/freelancer")
public class FreelancerController {

    @Autowired
    private FreelancerService freelancerService;

    @GetMapping("/profile/{freelancerId}")
    public ResponseEntity<?> getProfile(@PathVariable Long freelancerId) {
        try {
            User profile = freelancerService.getFreelancerProfile(freelancerId)
                    .orElseThrow(() -> new RuntimeException("Freelancer not found"));
                    
            Double rating = null;
            try {
                Performance perf = freelancerService.getFreelancerPerformance(freelancerId);
                rating = perf.getAvgRating();
            } catch (Exception e) {
                // Ignore if performance doesn't exist yet
            }
            
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("id", profile.getId());
            response.put("email", profile.getEmail());
            response.put("role", profile.getRole());
            response.put("balance", profile.getBalance());
            response.put("status", profile.getStatus());
            response.put("name", profile.getName());
            response.put("skills", profile.getSkills());
            response.put("rating", rating);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage() != null ? e.getMessage() : e.toString());
        }
    }

    @GetMapping("/tasks/{freelancerId}")
    public ResponseEntity<List<Task>> getAssignedTasks(@PathVariable Long freelancerId) {
        try {
            List<Task> tasks = freelancerService.getAssignedTasks(freelancerId);
            return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/milestones/{freelancerId}")
    public ResponseEntity<List<Milestone>> getFreelancerMilestones(@PathVariable Long freelancerId) {
        try {
            List<Milestone> milestones = freelancerService.getFreelancerMilestones(freelancerId);
            return ResponseEntity.ok(milestones);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/performance/{freelancerId}")
    public ResponseEntity<?> getPerformance(@PathVariable Long freelancerId) {
        try {
            Performance performance = freelancerService.getFreelancerPerformance(freelancerId);
            List<Milestone> milestones = freelancerService.getFreelancerMilestones(freelancerId);
            int completedTasks = freelancerService.getTotalTasksCompleted(freelancerId);

            double totalEarnings = milestones.stream()
                    .filter(m -> "APPROVED".equals(m.getStatus()) || "PAID".equals(m.getStatus()))
                    .mapToDouble(Milestone::getAmount)
                    .sum();

            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("completedTasks", completedTasks);
            response.put("successRate", performance.getCompletionRate() != null ? performance.getCompletionRate() : 0.0);
            response.put("totalEarnings", totalEarnings);
            response.put("averageRating", performance.getAvgRating() != null ? performance.getAvgRating() : 0.0);
            response.put("responseTime", performance.getOnTimeDeliveryRate() != null ? performance.getOnTimeDeliveryRate() : 0.0);
            response.put("performanceLevel", performance.getPerformanceLevel());
            response.put("onTimeDeliveryRate", performance.getOnTimeDeliveryRate() != null ? performance.getOnTimeDeliveryRate() : 0.0);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/submit-milestone/{milestoneId}")
    public ResponseEntity<?> submitMilestone(@PathVariable Long milestoneId,
            @RequestBody SubmitMilestoneRequest request,
            @RequestHeader("X-User-Id") Long freelancerId) {
        try {
            Milestone milestone = freelancerService.submitMilestone(milestoneId, request.getSubmissionUrl(),
                    freelancerId);
            return ResponseEntity.ok(milestone);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pending-milestones/{freelancerId}")
    public ResponseEntity<List<Milestone>> getPendingMilestones(@PathVariable Long freelancerId) {
        try {
            List<Milestone> milestones = freelancerService.getPendingMilestones(freelancerId);
            return ResponseEntity.ok(milestones);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<Task> getTaskDetails(@PathVariable Long taskId) {
        try {
            Task task = freelancerService.getTaskDetails(taskId);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/completed-tasks/{freelancerId}")
    public ResponseEntity<List<Task>> getCompletedTasks(@PathVariable Long freelancerId) {
        try {
            List<Task> tasks = freelancerService.getCompletedTasks(freelancerId);
            return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/stats/{freelancerId}")
    public ResponseEntity<?> getFreelancerStats(@PathVariable Long freelancerId) {
        try {
            int completedTasks = freelancerService.getTotalTasksCompleted(freelancerId);
            double avgRating = freelancerService.getAverageRating(freelancerId);
            
            int totalTasksAssigned = freelancerService.getAssignedTasks(freelancerId).size();
            List<Milestone> milestones = freelancerService.getFreelancerMilestones(freelancerId);
            
            long completedMilestones = milestones.stream()
                    .filter(m -> "PAID".equals(m.getStatus()) || "APPROVED".equals(m.getStatus()))
                    .count();
                    
            long pendingMilestones = milestones.stream()
                    .filter(m -> !("PAID".equals(m.getStatus()) || "APPROVED".equals(m.getStatus()) || "REJECTED".equals(m.getStatus())))
                    .count();
                    
            double totalEarned = milestones.stream()
                    .filter(m -> "PAID".equals(m.getStatus()) || "APPROVED".equals(m.getStatus()))
                    .mapToDouble(Milestone::getAmount)
                    .sum();

            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("completed_tasks", completedTasks);
            response.put("avg_rating", avgRating);
            response.put("totalTasksAssigned", totalTasksAssigned);
            response.put("completedMilestones", completedMilestones);
            response.put("pendingMilestones", pendingMilestones);
            response.put("totalEarned", totalEarned);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/profile/{freelancerId}")
    public ResponseEntity<?> updateProfile(@PathVariable Long freelancerId, @RequestBody java.util.Map<String, String> updates) {
        try {
            String name = updates.get("name");
            String skills = updates.get("skills");
            User updatedUser = freelancerService.updateFreelancerProfile(freelancerId, name, skills);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
