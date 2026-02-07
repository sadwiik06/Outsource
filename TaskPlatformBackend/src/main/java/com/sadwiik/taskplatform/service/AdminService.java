package com.sadwiik.taskplatform.service;

import com.sadwiik.taskplatform.model.Task;
import com.sadwiik.taskplatform.model.User;
import com.sadwiik.taskplatform.model.Performance;
import com.sadwiik.taskplatform.model.PaymentTransaction;
import com.sadwiik.taskplatform.model.AuditLog;
import com.sadwiik.taskplatform.repository.UserRepository;
import com.sadwiik.taskplatform.repository.TaskRepository;
import com.sadwiik.taskplatform.repository.PerformanceRepository;
import com.sadwiik.taskplatform.repository.PaymentRepository;
import com.sadwiik.taskplatform.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private PerformanceRepository performanceRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private AuditLogService auditLogService;

    // ---- USER MANAGEMENT ----
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public void suspendUser(Long userId, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        // Mark user as suspended (could add a suspended field to User model)
        auditLogService.logAction(userId, "SUSPEND_USER", "USER", userId, "Reason: " + reason);
    }

    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        auditLogService.logAction(userId, "ACTIVATE_USER", "USER", userId, "User reactivated");
    }

    // ---- TASK MANAGEMENT ----
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByStatus(String status) {
        return taskRepository.findAll().stream()
                .filter(t -> t.getStatus().equals(status))
                .toList();
    }

    public void cancelTask(Long taskId, String reason) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found: " + taskId));
        task.setStatus("CANCELLED");
        taskRepository.save(task);
        auditLogService.logAction(0L, "CANCEL_TASK", "TASK", taskId, "Reason: " + reason);
    }

    // ---- PAYMENT MANAGEMENT ----
    public List<PaymentTransaction> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<PaymentTransaction> getPaymentsByStatus(String status) {
        return paymentRepository.findAll().stream()
                .filter(p -> p.getStatus().equals(status))
                .toList();
    }

    public PaymentTransaction getPaymentDetails(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));
    }

    public void refundPayment(Long paymentId, String reason) {
        PaymentTransaction payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));
        payment.setStatus("REFUNDED");
        paymentRepository.save(payment);
        auditLogService.logAction(0L, "REFUND_PAYMENT", "PAYMENT", paymentId, "Reason: " + reason);
    }

    // ---- PERFORMANCE ANALYTICS ----
    public List<Performance> getAllPerformanceRecords() {
        return performanceRepository.findAll();
    }

    public List<Performance> getTopPerformers(int limit) {
        return performanceRepository.findAll().stream()
                .sorted((a, b) -> Double.compare(b.getAvgRating(), a.getAvgRating()))
                .limit(limit)
                .toList();
    }

    public List<Performance> getRiskUsers() {
        return performanceRepository.findAll().stream()
                .filter(p -> "RISK".equals(p.getPerformanceLevel()))
                .toList();
    }

    // ---- SYSTEM ANALYTICS ----
    public long getTotalUsers() {
        return userRepository.count();
    }

    public long getTotalTasks() {
        return taskRepository.count();
    }

    public long getTotalPayments() {
        return paymentRepository.count();
    }

    public double getTotalPaymentsAmount() {
        return paymentRepository.findAll().stream()
                .mapToDouble(PaymentTransaction::getAmount)
                .sum();
    }

    public long getCompletedTasksCount() {
        return taskRepository.findAll().stream()
                .filter(t -> "COMPLETED".equals(t.getStatus()))
                .count();
    }

    public long getDisputedTasksCount() {
        return taskRepository.findAll().stream()
                .filter(t -> "DISPUTED".equals(t.getStatus()))
                .count();
    }

    // ---- AUDIT LOGS ----
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }

    public List<AuditLog> getAuditLogsByUser(Long userId) {
        return auditLogRepository.findByUserId(userId);
    }

    public List<AuditLog> getAuditLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByTimestampBetween(startDate, endDate);
    }

    public List<AuditLog> getAuditLogsByAction(String action) {
        return auditLogRepository.findByAction(action);
    }
}
