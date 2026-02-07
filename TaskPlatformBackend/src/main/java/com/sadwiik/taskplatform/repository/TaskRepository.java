package com.sadwiik.taskplatform.repository;

import com.sadwiik.taskplatform.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByClientId(Long clientId);

    List<Task> findByFreelancerId(Long freelancerId);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT t.freelancerId FROM Task t WHERE t.freelancerId IS NOT NULL AND t.status NOT IN ('COMPLETED', 'CANCELLED')")
    List<Long> findBusyFreelancerIds();
}
