package com.sadwiik.taskplatform.repository;

import com.sadwiik.taskplatform.model.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<PaymentTransaction, Long> {

    List<PaymentTransaction> findByTaskId(Long taskId);

    List<PaymentTransaction> findByMilestoneId(Long milestoneId);
}
