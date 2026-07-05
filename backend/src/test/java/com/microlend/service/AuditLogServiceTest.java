package com.microlend.service;

import com.microlend.entity.AuditLog;
import com.microlend.repository.AuditLogRepository;
import com.microlend.service.impl.AuditLogServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuditLogServiceTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private AuditLogServiceImpl auditLogService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLog_success() {
        auditLogService.log(1L, "LOGIN", "AUTH");

        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
    }

    @Test
    void testGetAllLogs() {
        when(auditLogRepository.findAll()).thenReturn(List.of(new AuditLog()));

        List<AuditLog> logs = auditLogService.getAllLogs();

        assertNotNull(logs);
        assertEquals(1, logs.size());
    }
}