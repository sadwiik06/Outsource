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
