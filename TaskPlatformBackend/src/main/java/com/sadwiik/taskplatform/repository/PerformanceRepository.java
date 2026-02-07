package com.sadwiik.taskplatform.repository;

import com.sadwiik.taskplatform.model.Performance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PerformanceRepository extends JpaRepository<Performance, Long> {
    Optional<Performance> findByUserId(Long userId);
}