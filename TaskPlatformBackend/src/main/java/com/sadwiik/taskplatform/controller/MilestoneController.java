package com.sadwiik.taskplatform.controller;

import com.sadwiik.taskplatform.dto.ApproveMilestoneRequest;
import com.sadwiik.taskplatform.dto.ConfirmMilestonesRequest;
import com.sadwiik.taskplatform.dto.SubmitMilestoneRequest;
import com.sadwiik.taskplatform.model.Milestone;
import com.sadwiik.taskplatform.service.MilestoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/milestones")
public class MilestoneController {

    @Autowired
    private MilestoneService milestoneService;

    @GetMapping("/suggest/{taskId}")
    public ResponseEntity<?> suggestMilestones(@PathVariable Long taskId) {
        try {
            List<Milestone> suggestions = milestoneService.suggestMilestones(taskId);
            return ResponseEntity.ok(suggestions);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/confirm/{taskId}")
    public ResponseEntity<?> confirmMilestones(@PathVariable Long taskId,
            @RequestBody ConfirmMilestonesRequest request) {
        try {
            milestoneService.confirmMilestones(taskId, request.getMilestoneIds());
            return ResponseEntity.ok("Milestones confirmed for task: " + taskId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/submit/{milestoneId}")
    public ResponseEntity<String> submitMilestone(@PathVariable Long milestoneId,
            @RequestBody SubmitMilestoneRequest request) {
        try {
            milestoneService.submitMilestone(milestoneId, request.getSubmissionUrl());
            return ResponseEntity.ok("Milestone submitted: " + milestoneId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/approve/{milestoneId}")
    public ResponseEntity<String> forceApprove(@PathVariable Long milestoneId,
            @RequestBody(required = false) ApproveMilestoneRequest request) {
        try {
            String message = (request != null) ? request.getMessage() : null;
            milestoneService.forceApprove(milestoneId, message);
            return ResponseEntity.ok("Milestone approved: " + milestoneId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<Milestone>> getMilestonesByTaskId(@PathVariable Long taskId) {
        return ResponseEntity.ok(milestoneService.getMilestonesByTaskId(taskId));
    }
}
