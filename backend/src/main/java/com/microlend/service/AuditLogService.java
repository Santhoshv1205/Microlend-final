package com.microlend.service;

import com.microlend.entity.AuditLog;

import java.util.List;

public interface AuditLogService {

    void log(Long userID, String action, String module);

    List<AuditLog> getAllLogs();
}