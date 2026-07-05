package com.microlend.service.impl;

import com.microlend.entity.AuditLog;
import com.microlend.repository.AuditLogRepository;
import com.microlend.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    public void log(Long userID, String action, String module) {
        AuditLog log = AuditLog.builder()
                .userID(userID)
                .action(action)
                .module(module)
                .timestamp(LocalDateTime.now())
                .build();

        auditLogRepository.save(log);
    }

    @Override
    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }
}