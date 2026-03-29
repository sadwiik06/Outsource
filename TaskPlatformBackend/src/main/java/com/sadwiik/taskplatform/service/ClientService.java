package com.sadwiik.taskplatform.service;

import com.sadwiik.taskplatform.model.Milestone;
import com.sadwiik.taskplatform.model.Performance;
import com.sadwiik.taskplatform.model.Task;
import com.sadwiik.taskplatform.model.User;
import com.sadwiik.taskplatform.repository.PerformanceRepository;
import com.sadwiik.taskplatform.repository.TaskRepository;
import com.sadwiik.taskplatform.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private MilestoneService milestoneService;
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private PerformanceService performanceService;
    @Autowired
    private PerformanceRepository performanceRepository;
    @Autowired
    private FreelancerService freelancerService;

    public Task createTask(Task task) {
        task.setStatus("OPEN");
        return taskRepository.save(task);
    }

    public List<Milestone> getSuggestedMilestones(Long taskId) {
        return milestoneService.suggestMilestones(taskId);
    }

    public void assignFreelancer(Long taskId, Long freelancerId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setFreelancerId(freelancerId);
        task.setStatus("IN_PROGRESS");
        taskRepository.save(task);
        
        // Sync AI-suggested milestones to the newly hired freelancer
        milestoneService.assignFreelancerToMilestones(taskId, freelancerId);
    }

    public void fundMilestone(Long milestoneId) {
        paymentService.holdFundsForMilestone(milestoneId);
    }

    public void approveMilestone(Long milestoneId, String message) {
        milestoneService.forceApprove(milestoneId, message);
        performanceService.updateScoreAfterApproval(milestoneId);
    }

    public void rejectMilestone(Long milestoneId, String reason) {
        milestoneService.rejectMilestone(milestoneId, reason);
        performanceService.updateScoreAfterRejection(milestoneId);
    }

    public void rateFreelancer(Long taskId, Integer rating, String review) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setClientRating(rating);
        task.setClientReview(review);
        taskRepository.save(task);
        if (task.getFreelancerId() != null) {
            performanceService.calculateFreelancerPerformance(task.getFreelancerId());
        }
    }

    public List<Milestone> getClientMilestones(Long clientId) {
        return milestoneService.getMilestonesByClientId(clientId);
    }

    public List<FreelancerPerformanceDTO> getFreelancersWithPerformance() {
        List<Long> busyFreelancerIds = taskRepository.findBusyFreelancerIds();
        List<User> freelancers = userRepository.findAllByRole("FREELANCER");
        return freelancers.stream()
                .filter(f -> !busyFreelancerIds.contains(f.getId()))
                .map(freelancer -> {
                    Performance performance = performanceRepository.findByUserId(freelancer.getId())
                            .orElse(new Performance());
                    return new FreelancerPerformanceDTO(freelancer.getId(), freelancer.getEmail(), performance);
                }).collect(Collectors.toList());
    }

    public java.util.Map<String, Object> getFreelancerPublicProfile(Long freelancerId) {
        User profile = freelancerService.getFreelancerProfile(freelancerId)
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));
        Performance perf = freelancerService.getFreelancerPerformance(freelancerId);

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("id", profile.getId());
        response.put("email", profile.getEmail());
        response.put("name", profile.getName());
        response.put("skills", profile.getSkills());
        response.put("status", profile.getStatus());
        response.put("performanceLevel", perf.getPerformanceLevel());
        response.put("rating", perf.getAvgRating());
        response.put("successRate", perf.getCompletionRate());
        response.put("onTimeDelivery", perf.getOnTimeDeliveryRate());
        
        return response;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FreelancerPerformanceDTO {
        private Long id;
        private String email;
        private Performance performance;
    }
}
