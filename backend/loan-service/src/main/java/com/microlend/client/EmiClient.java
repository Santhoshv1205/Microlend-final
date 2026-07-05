package com.microlend.client;

import com.microlend.dto.request.ScheduleGenerationRequest;
import com.microlend.dto.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "emi-service", path = "/api/repayment-schedules")
public interface EmiClient {

    @PostMapping("/generate")
    ApiResponse<Void> generateSchedule(@RequestBody ScheduleGenerationRequest request);

    @GetMapping("/{loanAccountID}/schedule")
    ApiResponse<java.util.List<com.microlend.entity.RepaymentSchedule>> getSchedule(@PathVariable("loanAccountID") Long loanAccountID);
}
