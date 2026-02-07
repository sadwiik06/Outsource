package com.sadwiik.taskplatform.service;

import com.sadwiik.taskplatform.model.Performance;
import com.sadwiik.taskplatform.model.Task;
import com.sadwiik.taskplatform.model.Milestone;
import com.sadwiik.taskplatform.repository.PerformanceRepository;
import com.sadwiik.taskplatform.repository.TaskRepository;
import com.sadwiik.taskplatform.repository.MilestoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PerformanceService {

    @Autowired
    private PerformanceRepository performanceRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private MilestoneRepository milestoneRepository;

    
    public Performance calculateFreelancerPerformance(Long freelancerId) {

        var freelancerTasks = taskRepository.findByFreelancerId(freelancerId);
        
        long totalTasks = freelancerTasks.size();
        long completedTasks = freelancerTasks.stream()
                .filter(t -> "COMPLETED".equals(t.getStatus()))
                .count();

        double completionRate = totalTasks > 0 ? (completedTasks / (double) totalTasks) * 100 : 0;

        var freelancerMilestones = milestoneRepository.findByFreelancerId(freelancerId);
        long totalMilestones = freelancerMilestones.size();
        long approvedMilestones = freelancerMilestones.stream()
                .filter(m -> "APPROVED".equals(m.getStatus()) || "PAID".equals(m.getStatus()))
                .count();

        double onTimeRate = totalMilestones > 0 ? (approvedMilestones / (double) totalMilestones) * 100 : 0;

        double avgRating = freelancerTasks.stream()
                .filter(t -> t.getClientRating() != null)
                .mapToInt(Task::getClientRating)
                .average()
                .orElse(0.0);

        int disputes = (int) freelancerTasks.stream()
                .filter(t -> "DISPUTED".equals(t.getStatus()))
                .count();

        double earningsGrowth = calculateEarningsGrowth(freelancerId);

        Performance perf = performanceRepository.findByUserId(freelancerId)
                .orElse(new Performance());
        
        perf.setUserId(freelancerId);
        perf.setCompletionRate(completionRate);
        perf.setOnTimeDeliveryRate(onTimeRate);
        perf.setAvgRating(avgRating);
        perf.setDisputesCount(disputes);
        perf.setEarningsGrowth(earningsGrowth);
        perf.setPerformanceLevel(determinePerformanceLevel(perf));

        return performanceRepository.save(perf);
    }

    public Performance calculateClientPerformance(Long clientId) {

        var clientTasks = taskRepository.findByClientId(clientId);
        
        long totalTasks = clientTasks.size();
        long completedTasks = clientTasks.stream()
                .filter(t -> "COMPLETED".equals(t.getStatus()))
                .count();

        double completionRate = totalTasks > 0 ? (completedTasks / (double) totalTasks) * 100 : 0;

        double avgRating = 4.2; // Could calculate from freelancer ratings if available

        int disputes = (int) clientTasks.stream()
                .filter(t -> "DISPUTED".equals(t.getStatus()))
                .count();

        Performance perf = performanceRepository.findByUserId(clientId)
                .orElse(new Performance());
        
        perf.setUserId(clientId);
        perf.setCompletionRate(completionRate);
        perf.setAvgRating(avgRating);
        perf.setDisputesCount(disputes);

        perf.setPerformanceLevel(determinePerformanceLevel(perf));

        return performanceRepository.save(perf);
    }

    public String determinePerformanceLevel(Performance p) {

        if (p.getCompletionRate() >= 95 &&
            p.getAvgRating() >= 4.5 &&
            p.getDisputesCount() <= 1) {
            return "GOLD";
        }

        if (p.getCompletionRate() >= 85 &&
            p.getAvgRating() >= 4.0) {
            return "SILVER";
        }

        if (p.getCompletionRate() >= 70) {
            return "BRONZE";
        }

        return "RISK";
    }

    public void updateScoreAfterApproval(Long milestoneId) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));

        Task task = milestone.getTask();
        Long freelancerId = milestone.getFreelancerId();
        Long clientId = task.getClientId();

        // Update freelancer performance
        calculateFreelancerPerformance(freelancerId);

        // Update client performance
        calculateClientPerformance(clientId);
    }

    public void updateScoreAfterRejection(Long milestoneId) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));

        Task task = milestone.getTask();
        Long freelancerId = milestone.getFreelancerId();
        Long clientId = task.getClientId();

        // Update freelancer performance (rejections negatively impact score)
        Performance freelancerPerf = performanceRepository.findByUserId(freelancerId)
                .orElse(new Performance());
        freelancerPerf.setDisputesCount(freelancerPerf.getDisputesCount() + 1);
        performanceRepository.save(freelancerPerf);

        // Update client performance
        calculateClientPerformance(clientId);
    }

    private double calculateEarningsGrowth(Long freelancerId) {
        // Calculate earnings growth percentage over time (placeholder)
        return 15.0;
    }
}