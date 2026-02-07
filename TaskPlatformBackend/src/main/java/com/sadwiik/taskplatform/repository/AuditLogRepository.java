package com.sadwiik.taskplatform.repository;

import com.sadwiik.taskplatform.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUserId(Long userId);

    List<AuditLog> findByEntityType(String entityType);

    List<AuditLog> findByEntityId(Long entityId);

    List<AuditLog> findByAction(String action);

    List<AuditLog> findByTimestampBetween(LocalDateTime startTime, LocalDateTime endTime);
}
