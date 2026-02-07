package com.sadwiik.taskplatform.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String action; // e.g., CREATE_TASK, ASSIGN_FREELANCER, APPROVE_MILESTONE

    @Column(nullable = false)
    private String entityType; // TASK, MILESTONE, PAYMENT, USER

    private Long entityId; // Reference to the affected entity

    @Column(length = 1000)
    private String details; // Additional context

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}
