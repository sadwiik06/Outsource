package com.sadwiik.taskplatform.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payment_transactions")
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long taskId;
    private Long milestoneId;

    private Long payerId;     // client
    private Long payeeId;     // freelancer

    private Double amount;

    private String status;
    /*
        HELD
        RELEASED
        REFUNDED
        DISPUTED
    */

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
