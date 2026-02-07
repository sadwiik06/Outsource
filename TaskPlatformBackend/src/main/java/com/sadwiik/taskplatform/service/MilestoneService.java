package com.sadwiik.taskplatform.service;

import com.sadwiik.taskplatform.model.*;
import com.sadwiik.taskplatform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MilestoneService {

    @Autowired
    private MilestoneRepository milestoneRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private PaymentService paymentService;

    public List<Milestone> suggestMilestones(Long taskId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (task.getFreelancerId() == null) {
            throw new RuntimeException("Task must be assigned to a freelancer before suggesting milestones");
        }

        // 🔮 AI PLACEHOLDER (later replace with LLM call)
        // NOTE: These ARE saved to DB with SUGGESTED status so they have IDs
        Milestone m1 = new Milestone();
        m1.setTask(task);
        m1.setFreelancerId(task.getFreelancerId());
        m1.setClientId(task.getClientId());
        m1.setTitle("Initial Setup");
        m1.setDescription("Project setup and basic structure");
        m1.setAmount(task.getTotalBudget() * 0.3);
        m1.setSequenceOrder(1);
        m1.setStatus("SUGGESTED");

        Milestone m2 = new Milestone();
        m2.setTask(task);
        m2.setFreelancerId(task.getFreelancerId());
        m2.setClientId(task.getClientId());
        m2.setTitle("Core Implementation");
        m2.setDescription("Main functionality development");
        m2.setAmount(task.getTotalBudget() * 0.5);
        m2.setSequenceOrder(2);
        m2.setStatus("SUGGESTED");

        Milestone m3 = new Milestone();
        m3.setTask(task);
        m3.setFreelancerId(task.getFreelancerId());
        m3.setClientId(task.getClientId());
        m3.setTitle("Final Delivery");
        m3.setDescription("Testing, optimization, and final delivery");
        m3.setAmount(task.getTotalBudget() * 0.2);
        m3.setSequenceOrder(3);
        m3.setStatus("SUGGESTED");

        return milestoneRepository.saveAll(List.of(m1, m2, m3));
    }

    public void confirmMilestones(Long taskId, List<Long> milestoneIds) {
        if (milestoneIds == null || milestoneIds.isEmpty()) {
            throw new RuntimeException("Ids must not be null");
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        List<Milestone> milestones = milestoneRepository.findAllById(milestoneIds);

        if (milestones.isEmpty()) {
            throw new RuntimeException("No milestones found with provided IDs");
        }

        // Validate all milestones belong to the task and have correct clientId
        for (Milestone milestone : milestones) {
            if (!milestone.getTask().getId().equals(taskId)) {
                throw new RuntimeException("Milestone " + milestone.getId() + " does not belong to task " + taskId);
            }
            if (milestone.getClientId() == null || !milestone.getClientId().equals(task.getClientId())) {
                throw new RuntimeException("Milestone " + milestone.getId() + " has invalid clientId");
            }
            milestone.setStatus("FUNDED");
            paymentService.holdFundsForMilestone(milestone.getId());
        }

        milestoneRepository.saveAll(milestones);
    }

    public void submitMilestone(Long milestoneId, String submissionUrl) {

        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));

        if (!"FUNDED".equals(milestone.getStatus()) && !"SUGGESTED".equals(milestone.getStatus())
                && !"REJECTED".equals(milestone.getStatus()) && !"CREATED".equals(milestone.getStatus())) {
            throw new RuntimeException(
                    "Milestone must be FUNDED, SUGGESTED, REJECTED, or CREATED before submission. Current status: "
                            + milestone.getStatus());
        }

        milestone.setSubmissionUrl(submissionUrl);
        milestone.setSubmittedAt(LocalDateTime.now());
        milestone.setStatus("SUBMITTED");

        milestoneRepository.save(milestone);
    }

    public void forceApprove(Long milestoneId, String message) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));

        milestone.setStatus("APPROVED");
        milestone.setApprovalMessage(message);
        milestoneRepository.saveAndFlush(milestone);

        // Automate payment release
        paymentService.releaseMilestonePayment(milestoneId);
    }

    public List<Milestone> getMilestonesByClientId(Long clientId) {
        return milestoneRepository.findByClientId(clientId);
    }

    public List<Milestone> getMilestonesByTaskId(Long taskId) {
        return milestoneRepository.findByTaskId(taskId);
    }

    public void rejectMilestone(Long milestoneId, String reason) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));

        milestone.setStatus("REJECTED");
        milestone.setRejectionReason(reason);
        milestoneRepository.save(milestone);
    }
}
