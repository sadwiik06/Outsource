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
    public ResponseEntity<User> getProfile(@PathVariable Long freelancerId) {
        try {
            User profile = freelancerService.getFreelancerProfile(freelancerId)
                    .orElseThrow(() -> new RuntimeException("Freelancer not found"));
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
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
    public ResponseEntity<Performance> getPerformance(@PathVariable Long freelancerId) {
        try {
            Performance performance = freelancerService.getFreelancerPerformance(freelancerId);
            return ResponseEntity.ok(performance);
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
            return ResponseEntity.ok(new Object() {
                public int completed_tasks = completedTasks;
                public double avg_rating = avgRating;
            });
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
