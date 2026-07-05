package com.microlend.client;

import com.microlend.dto.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-service", contextId = "auditClient", path = "/api/admin/audit-logs")
public interface AuditClient {

    @PostMapping("/internal")
    ApiResponse<Void> logActivity(
            @RequestParam("userID") Long userID,
            @RequestParam("action") String action,
            @RequestParam("module") String module);
}
