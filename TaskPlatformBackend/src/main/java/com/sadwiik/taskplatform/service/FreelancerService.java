package com.sadwiik.taskplatform.service;

import com.sadwiik.taskplatform.model.Performance;
import com.sadwiik.taskplatform.model.Task;
import com.sadwiik.taskplatform.model.User;
import com.sadwiik.taskplatform.model.Milestone;
import com.sadwiik.taskplatform.repository.UserRepository;
import com.sadwiik.taskplatform.repository.TaskRepository;
import com.sadwiik.taskplatform.repository.PerformanceRepository;
import com.sadwiik.taskplatform.repository.MilestoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FreelancerService {

    @Autowired
    private MilestoneService milestoneService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private PerformanceRepository performanceRepository;

    @Autowired
    private MilestoneRepository milestoneRepository;

    @Autowired
    private AuditLogService auditLogService;

    public Optional<User> getFreelancerProfile(Long freelancerId) {
        return userRepository.findById(freelancerId);
    }

    public List<Task> getAssignedTasks(Long freelancerId) {
        return taskRepository.findByFreelancerId(freelancerId);
    }

    public List<Milestone> getFreelancerMilestones(Long freelancerId) {
        return milestoneRepository.findByFreelancerId(freelancerId);
    }

    public Performance getFreelancerPerformance(Long freelancerId) {
        return performanceRepository.findByUserId(freelancerId)
                .orElseThrow(
                        () -> new RuntimeException("Performance record not found for freelancer: " + freelancerId));
    }

    public Milestone getMilestone(Long milestoneId) {
        return milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found: " + milestoneId));
    }

    public Milestone submitMilestone(Long milestoneId, String submissionUrl, Long freelancerId) {
        Milestone milestone = getMilestone(milestoneId);

        if (!milestone.getFreelancerId().equals(freelancerId)) {
            throw new RuntimeException("Unauthorized: Milestone not assigned to this freelancer");
        }

        milestoneService.submitMilestone(milestoneId, submissionUrl);

        auditLogService.logAction(freelancerId, "SUBMIT_MILESTONE", "MILESTONE", milestoneId,
                "Submitted milestone with URL: " + submissionUrl);
        return getMilestone(milestoneId);
    }

    public List<Milestone> getPendingMilestones(Long freelancerId) {
        List<Milestone> milestones = milestoneRepository.findByFreelancerId(freelancerId);
        return milestones.stream()
                .filter(m -> !m.getStatus().equals("PAID") && !m.getStatus().equals("APPROVED"))
                .toList();
    }

    public Task getTaskDetails(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found: " + taskId));
    }

    public List<Task> getCompletedTasks(Long freelancerId) {
        List<Task> tasks = taskRepository.findByFreelancerId(freelancerId);
        return tasks.stream()
                .filter(t -> "COMPLETED".equals(t.getStatus()))
                .toList();
    }

    public int getTotalTasksCompleted(Long freelancerId) {
        return getCompletedTasks(freelancerId).size();
    }
    public double getAverageRating(Long freelancerId) {
    Performance perf = performanceRepository.findByUserId(freelancerId)
    .orElse(null);
    return perf != null ? perf.getAvgRating() : 0.0;
    }
}
