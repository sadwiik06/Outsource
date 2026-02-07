package com.sadwiik.taskplatform.controller;

import com.sadwiik.taskplatform.model.AuditLog;
import com.sadwiik.taskplatform.model.Performance;
import com.sadwiik.taskplatform.model.Task;
import com.sadwiik.taskplatform.model.User;
import com.sadwiik.taskplatform.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ---- USER MANAGEMENT ----
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = adminService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        try {
            User user = adminService.getUserById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/users/{userId}/suspend")
    public ResponseEntity<String> suspendUser(@PathVariable Long userId, @RequestBody String reason) {
        try {
            adminService.suspendUser(userId, reason);
            return ResponseEntity.ok("User suspended: " + userId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/users/{userId}/activate")
    public ResponseEntity<String> activateUser(@PathVariable Long userId) {
        try {
            adminService.activateUser(userId);
            return ResponseEntity.ok("User activated: " + userId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ---- TASK MANAGEMENT ----
    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getAllTasks() {
        try {
            List<Task> tasks = adminService.getAllTasks();
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/tasks/status/{status}")
    public ResponseEntity<List<Task>> getTasksByStatus(@PathVariable String status) {
        try {
            List<Task> tasks = adminService.getTasksByStatus(status);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/tasks/{taskId}/cancel")
    public ResponseEntity<String> cancelTask(@PathVariable Long taskId, @RequestBody String reason) {
        try {
            adminService.cancelTask(taskId, reason);
            return ResponseEntity.ok("Task cancelled: " + taskId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ---- PAYMENT MANAGEMENT ----
    @GetMapping("/payments")
    public ResponseEntity<?> getAllPayments() {
        try {
            var payments = adminService.getAllPayments();
            var totalAmount = adminService.getTotalPaymentsAmount();
            return ResponseEntity.ok(new Object() {
                public List paymentList = payments;
                public double total = totalAmount;
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/payments/status/{status}")
    public ResponseEntity<?> getPaymentsByStatus(@PathVariable String status) {
        try {
            var payments = adminService.getPaymentsByStatus(status);
            var totalAmount = payments.stream().mapToDouble(p -> p.getAmount()).sum();
            return ResponseEntity.ok(new Object() {
                public List paymentList = payments;
                public double total = totalAmount;
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/payments/{paymentId}/refund")
    public ResponseEntity<String> refundPayment(@PathVariable Long paymentId, @RequestBody String reason) {
        try {
            adminService.refundPayment(paymentId, reason);
            return ResponseEntity.ok("Payment refunded: " + paymentId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ---- PERFORMANCE ANALYTICS ----
    @GetMapping("/performance/all")
    public ResponseEntity<List<Performance>> getAllPerformance() {
        try {
            List<Performance> records = adminService.getAllPerformanceRecords();
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/performance/top/{limit}")
    public ResponseEntity<List<Performance>> getTopPerformers(@PathVariable int limit) {
        try {
            List<Performance> topPerformers = adminService.getTopPerformers(limit);
            return ResponseEntity.ok(topPerformers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/performance/risk")
    public ResponseEntity<List<Performance>> getRiskUsers() {
        try {
            List<Performance> riskUsers = adminService.getRiskUsers();
            return ResponseEntity.ok(riskUsers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ---- SYSTEM ANALYTICS ----
    @GetMapping("/analytics/dashboard")
    public ResponseEntity<?> getDashboard() {
        try {
            return ResponseEntity.ok(new Object() {
                public long total_users = adminService.getTotalUsers();
                public long total_tasks = adminService.getTotalTasks();
                public long total_payments_count = adminService.getTotalPayments();
                public double total_payments_amount = adminService.getTotalPaymentsAmount();
                public long completed_tasks = adminService.getCompletedTasksCount();
                public long disputed_tasks = adminService.getDisputedTasksCount();
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ---- AUDIT LOGS ----
    @GetMapping("/audits")
    public ResponseEntity<List<AuditLog>> getAllAuditLogs() {
        try {
            List<AuditLog> logs = adminService.getAllAuditLogs();
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/audits/user/{userId}")
    public ResponseEntity<List<AuditLog>> getAuditLogsByUser(@PathVariable Long userId) {
        try {
            List<AuditLog> logs = adminService.getAuditLogsByUser(userId);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/audits/action/{action}")
    public ResponseEntity<List<AuditLog>> getAuditLogsByAction(@PathVariable String action) {
        try {
            List<AuditLog> logs = adminService.getAuditLogsByAction(action);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
