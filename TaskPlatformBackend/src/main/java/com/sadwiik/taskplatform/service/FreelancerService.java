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
    private PerformanceService performanceService;

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
        return userRepository.findById(freelancerId).map(user -> {
            
            taskRepository.findByFreelancerId(freelancerId).stream()
                .filter(t -> !"COMPLETED".equals(t.getStatus()))
                .forEach(t -> {
                    List<Milestone> tMs = milestoneRepository.findByTaskId(t.getId());
                    if (!tMs.isEmpty() && tMs.stream().allMatch(m -> "APPROVED".equals(m.getStatus()) || "PAID".equals(m.getStatus()))) {
                        t.setStatus("COMPLETED");
                        taskRepository.save(t);
                        performanceService.calculateFreelancerPerformance(freelancerId);
                    }
                });

            if (user.getStatus() != com.sadwiik.taskplatform.model.enums.AccountStatus.CLOSED) {
                long activeTasks = taskRepository.findByFreelancerId(freelancerId).stream()
                        .filter(t -> "IN_PROGRESS".equals(t.getStatus()) || "OPEN".equals(t.getStatus()))
                        .count();
                com.sadwiik.taskplatform.model.enums.AccountStatus computedStatus = 
                        activeTasks > 0 ? com.sadwiik.taskplatform.model.enums.AccountStatus.ACTIVE : com.sadwiik.taskplatform.model.enums.AccountStatus.OPEN;
                        
                if (user.getStatus() != computedStatus) {
                    user.setStatus(computedStatus);
                    userRepository.save(user);
                }
            }
            return user;
        });
    }
    
    public User updateFreelancerProfile(Long freelancerId, String name, String skills) {
        User user = userRepository.findById(freelancerId)
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));
        user.setName(name);
        user.setSkills(skills);
        return userRepository.save(user);
    }

    public List<Task> getAssignedTasks(Long freelancerId) {
        return taskRepository.findByFreelancerId(freelancerId);
    }

    public List<Milestone> getFreelancerMilestones(Long freelancerId) {
        return milestoneRepository.findByFreelancerId(freelancerId);
    }

    public Performance getFreelancerPerformance(Long freelancerId) {
        return performanceService.calculateFreelancerPerformance(freelancerId);
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
