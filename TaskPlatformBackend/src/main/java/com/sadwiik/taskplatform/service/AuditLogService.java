package com.sadwiik.taskplatform.service;

import com.sadwiik.taskplatform.model.AuditLog;
import com.sadwiik.taskplatform.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public AuditLog logAction(Long userId, String action, String entityType, Long entityId, String details) {
        AuditLog log = new AuditLog();
        log.setUserId(userId);
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setDetails(details);
        return auditLogRepository.save(log);
    }

    public List<AuditLog> getAuditsByUser(Long userId) {
        return auditLogRepository.findByUserId(userId);
    }

    public List<AuditLog> getAuditsByEntityType(String entityType) {
        return auditLogRepository.findByEntityType(entityType);
    }

    public List<AuditLog> getAuditsByEntity(Long entityId) {
        return auditLogRepository.findByEntityId(entityId);
    }

    public List<AuditLog> getAuditsByAction(String action) {
        return auditLogRepository.findByAction(action);
    }

    public List<AuditLog> getAuditsByDateRange(LocalDateTime startTime, LocalDateTime endTime) {
        return auditLogRepository.findByTimestampBetween(startTime, endTime);
    }

    public List<AuditLog> getAllAudits() {
        return auditLogRepository.findAll();
    }
}
