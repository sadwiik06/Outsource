package com.sadwiik.taskplatform.controller;

import com.sadwiik.taskplatform.dto.ApproveMilestoneRequest;
import com.sadwiik.taskplatform.dto.RejectMilestoneRequest;
import com.sadwiik.taskplatform.model.Milestone;
import com.sadwiik.taskplatform.model.Task;
import com.sadwiik.taskplatform.model.User;
import com.sadwiik.taskplatform.repository.UserRepository;
import com.sadwiik.taskplatform.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client")
public class ClientController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClientService clientService;

    @GetMapping("/profile/{clientId}")
    public ResponseEntity<User> getProfile(@PathVariable Long clientId) {
        return userRepository.findById(clientId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/tasks")
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        try {
            if (task.getTitle() == null || task.getTitle().isEmpty()) {
                return ResponseEntity.badRequest().body(
                        java.util.Map.of("message", "Task title is required"));
            }
            if (task.getTotalBudget() == null || task.getTotalBudget() <= 0) {
                return ResponseEntity.badRequest().body(
                        java.util.Map.of("message", "Task budget must be greater than 0"));
            }
            if (task.getClientId() == null) {
                return ResponseEntity.badRequest().body(
                        java.util.Map.of("message", "Client ID is required"));
            }

            Task createdTask = clientService.createTask(task);
            return ResponseEntity.ok(createdTask);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of("message", "Error creating task: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of("message", "Unexpected error: " + e.getMessage()));
        }
    }

    @GetMapping("/milestones/suggest/{taskId}")
    public ResponseEntity<List<Milestone>> getSuggestedMilestones(@PathVariable Long taskId) {
        try {
            List<Milestone> milestones = clientService.getSuggestedMilestones(taskId);
            return ResponseEntity.ok(milestones);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/assign-freelancer/{taskId}/{freelancerId}")
    public ResponseEntity<String> assignFreelancer(@PathVariable Long taskId, @PathVariable Long freelancerId) {
        try {
            clientService.assignFreelancer(taskId, freelancerId);
            return ResponseEntity.ok("Freelancer assigned to task: " + taskId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/fund-milestone/{milestoneId}")
    public ResponseEntity<String> fundMilestone(@PathVariable Long milestoneId) {
        try {
            clientService.fundMilestone(milestoneId);
            return ResponseEntity.ok("Milestone funded: " + milestoneId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/approve-milestone/{milestoneId}")
    public ResponseEntity<String> approveMilestone(@PathVariable Long milestoneId,
            @RequestBody(required = false) ApproveMilestoneRequest request) {
        try {
            String message = (request != null) ? request.getMessage() : null;
            clientService.approveMilestone(milestoneId, message);
            return ResponseEntity.ok("Milestone approved: " + milestoneId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reject-milestone/{milestoneId}")
    public ResponseEntity<String> rejectMilestone(@PathVariable Long milestoneId,
            @RequestBody RejectMilestoneRequest request) {
        try {
            clientService.rejectMilestone(milestoneId, request.getReason());
            return ResponseEntity.ok("Milestone rejected: " + milestoneId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/freelancers")
    public ResponseEntity<List<ClientService.FreelancerPerformanceDTO>> getFreelancersWithPerformance() {
        try {
            List<ClientService.FreelancerPerformanceDTO> freelancers = clientService.getFreelancersWithPerformance();
            return ResponseEntity.ok(freelancers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/milestones/{clientId}")
    public ResponseEntity<List<Milestone>> getClientMilestones(@PathVariable Long clientId) {
        try {
            List<Milestone> milestones = clientService.getClientMilestones(clientId);
            return ResponseEntity.ok(milestones);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
