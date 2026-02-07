package com.sadwiik.taskplatform.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.sadwiik.taskplatform.util.LocalDateTimeDeserializer;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ---- Ownership ----
    @Column(nullable = false)
    private Long clientId;

    private Long freelancerId; // null until assigned

    // ---- Task Details ----
    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @ElementCollection
    private List<String> skills;

    @Column(nullable = false)
    private String category; // e.g. Web, AI, Design, Backend

    private String difficulty; // EASY / MEDIUM / HARD (AI can infer)

    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime deadline;

    // ---- Budget ----
    @Column(nullable = false)
    private Double totalBudget;

    private Double escrowAmount = 0.0;

    // ---- Status ----
    @Column(nullable = false)
    private String status;
    /*
        OPEN
        IN_PROGRESS
        COMPLETED
        DISPUTED
        CANCELLED
    */

    // ---- Milestones ----
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Milestone> milestones;

    // ---- Ratings ----
    private Integer clientRating; // given by client to freelancer
    private String clientReview;

    // ---- Audit ----
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
