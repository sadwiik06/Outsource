package com.sadwiik.taskplatform.service;

import com.sadwiik.taskplatform.model.*;
import com.sadwiik.taskplatform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
        @Autowired
        private PaymentRepository paymentRepository;
        @Autowired
        private MilestoneRepository milestoneRepository;
        @Autowired
        private TaskRepository taskRepository;
        @Autowired
        private UserRepository userRepository;

        public void holdFundsForMilestone(Long milestoneId) {

                Milestone milestone = milestoneRepository.findById(milestoneId)
                                .orElseThrow(() -> new RuntimeException("Milestone not found"));

                Task task = taskRepository.findById(milestone.getTask().getId())
                                .orElseThrow(() -> new RuntimeException("Task not found"));

                /*
                 * User client = userRepository.findById(task.getClientId())
                 * .orElseThrow(() -> new RuntimeException("Client not found"));
                 */

                /*
                 * if (client.getBalance() < milestone.getAmount()) {
                 * throw new RuntimeException("Insufficient balance to fund milestone: " +
                 * milestone.getId());
                 * }
                 * 
                 * // Deduct from client
                 * client.setBalance(client.getBalance() - milestone.getAmount());
                 * userRepository.save(client);
                 */

                PaymentTransaction tx = new PaymentTransaction();
                tx.setTaskId(task.getId());
                tx.setMilestoneId(milestoneId);
                tx.setPayerId(task.getClientId());
                tx.setPayeeId(task.getFreelancerId());
                tx.setAmount(milestone.getAmount());
                tx.setStatus("HELD");

                paymentRepository.save(tx);
        }

        public void releaseMilestonePayment(Long milestoneId) {

                Milestone milestone = milestoneRepository.findById(milestoneId)
                                .orElseThrow(() -> new RuntimeException("Milestone not found"));

                // Only release payment if milestone is APPROVED
                if (!"APPROVED".equals(milestone.getStatus())) {
                        throw new RuntimeException(
                                        "Cannot release payment: Milestone must be APPROVED. Current status: "
                                                        + milestone.getStatus());
                }

                PaymentTransaction tx = paymentRepository
                                .findByMilestoneId(milestoneId)
                                .stream()
                                .findFirst()
                                .orElseGet(() -> {
                                        // 🚀 Auto-fund if skipped by client
                                        holdFundsForMilestone(milestoneId);
                                        return paymentRepository.findByMilestoneId(milestoneId).get(0);
                                });

                if ("RELEASED".equals(tx.getStatus())) {
                        throw new RuntimeException("Payment already released for milestone: " + milestoneId);
                }

                // Move money to freelancer
                /*
                 * User freelancer = userRepository.findById(tx.getPayeeId())
                 * .orElseThrow(() -> new RuntimeException("Freelancer not found"));
                 */

                /*
                 * freelancer.setBalance(freelancer.getBalance() + tx.getAmount());
                 * userRepository.save(freelancer);
                 */

                // Update transaction and milestone status
                tx.setStatus("RELEASED");
                paymentRepository.save(tx);

                milestone.setStatus("PAID");
                milestoneRepository.save(milestone);
        }

        public void refundMilestonePayment(Long milestoneId) {

                Milestone milestone = milestoneRepository.findById(milestoneId)
                                .orElseThrow(() -> new RuntimeException("Milestone not found"));

                PaymentTransaction tx = paymentRepository
                                .findByMilestoneId(milestoneId)
                                .stream()
                                .findFirst()
                                .orElseThrow(() -> new RuntimeException("Payment not found"));

                // Only refund if payment hasn't been released yet
                if ("RELEASED".equals(tx.getStatus())) {
                        throw new RuntimeException("Cannot refund: Payment has already been released");
                }

                tx.setStatus("REFUNDED");
                paymentRepository.save(tx);
        }
}
