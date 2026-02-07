package com.sadwiik.taskplatform.controller;

import com.sadwiik.taskplatform.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/hold/{milestoneId}")
    public ResponseEntity<String> holdFundsForMilestone(@PathVariable Long milestoneId) {
        try {
            paymentService.holdFundsForMilestone(milestoneId);
            return ResponseEntity.ok("Funds held for milestone: " + milestoneId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/release/{milestoneId}")
    public ResponseEntity<String> releaseMilestonePayment(@PathVariable Long milestoneId) {
        try {
            paymentService.releaseMilestonePayment(milestoneId);
            return ResponseEntity.ok("Payment released for milestone: " + milestoneId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/refund/{milestoneId}")
    public ResponseEntity<String> refundMilestonePayment(@PathVariable Long milestoneId) {
        try {
            paymentService.refundMilestonePayment(milestoneId);
            return ResponseEntity.ok("Payment refunded for milestone: " + milestoneId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
