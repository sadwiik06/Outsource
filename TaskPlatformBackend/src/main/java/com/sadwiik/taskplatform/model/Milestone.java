package com.sadwiik.taskplatform.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "milestones")
public class Milestone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ---- Relations ----
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    @JsonBackReference
    private Task task;

    @Column(name = "freelancer_id", nullable = false)
    private Long freelancerId;

    @Column(name = "client_id", nullable = false)
    private Long clientId;

    @Column(nullable = false)
    private String title;

    @Column(length = 1500)
    private String description;

    @Column(nullable = false)
    private Double amount;

    private Integer sequenceOrder; // 1,2,3... (AI generated)

    // ---- Status ----
    @Column(nullable = false)
    private String status;
    /*
     * CREATED
     * FUNDED
     * SUBMITTED
     * APPROVED
     * REJECTED
     * DISPUTED
     * PAID
     */

    // ---- Submission ----
    private String submissionUrl; // GitHub / Drive / Figma etc
    private LocalDateTime submittedAt;
    private String rejectionReason; // Feedback from client
    private String approvalMessage; // Message left upon approval

    // ---- Audit ----
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.status = "CREATED";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ---- Helper Methods ----
    /**
     * Ensures clientId is synchronized with the Task relationship
     */
    public void syncClientIdFromTask() {
        if (this.task != null && this.task.getClientId() != null) {
            this.clientId = this.task.getClientId();
        }
    }

    /**
     * Ensures freelancerId is synchronized with the Task relationship
     */
    public void syncFreelancerIdFromTask() {
        if (this.task != null && this.task.getFreelancerId() != null) {
            this.freelancerId = this.task.getFreelancerId();
        }
    }
}
