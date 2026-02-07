package com.sadwiik.taskplatform.repository;

import com.sadwiik.taskplatform.model.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MilestoneRepository extends JpaRepository<Milestone, Long> {

    List<Milestone> findByTaskId(Long taskId);

    List<Milestone> findByFreelancerId(Long freelancerId);
    
    List<Milestone> findByClientId(Long clientId);

}