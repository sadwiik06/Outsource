package com.sadwiik.taskplatform.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "performance")
public class Performance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId; // References Client or Freelancer ID

    @Column(nullable = false)
    private Double completionRate; // Percentage

    private Double onTimeDeliveryRate; // Percentage, primarily for freelancers

    @Column(nullable = false)
    private Double avgRating; // Average client/freelancer rating

    @Column(nullable = false)
    private Integer disputesCount; // Number of disputes

    private Double earningsGrowth; // Percentage, primarily for freelancers

    @Column(nullable = false)
    private String performanceLevel; // e.g., GOLD, SILVER, BRONZE, RISK

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
