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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    @JsonBackReference
    private Task task;

    @Column(name = "freelancer_id", nullable = true)
    private Long freelancerId;

    @Column(name = "client_id", nullable = false)
    private Long clientId;

    @Column(nullable = false)
    private String title;

    @Column(length = 1500)
    private String description;

    @Column(nullable = false)
    private Double amount;

    private Integer sequenceOrder;

    @Column(nullable = false)
    private String status;

    private String submissionUrl;
    private LocalDateTime dueDate;
    private LocalDateTime submittedAt;
    private String rejectionReason;
    private String approvalMessage;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.status == null) {
            this.status = "CREATED";
        }
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void syncClientIdFromTask() {
        if (this.task != null && this.task.getClientId() != null) {
            this.clientId = this.task.getClientId();
        }
    }

    public void syncFreelancerIdFromTask() {
        if (this.task != null && this.task.getFreelancerId() != null) {
            this.freelancerId = this.task.getFreelancerId();
        }
    }

    @Transient
    public String getTaskTitle() {
        return this.task != null ? this.task.getTitle() : null;
    }
}
