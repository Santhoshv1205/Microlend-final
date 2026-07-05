package com.microlend.client;

import com.microlend.dto.response.ApiResponse;
import com.microlend.entity.LoanAccount;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@FeignClient(name = "loan-service", path = "/api/loan-accounts")
public interface LoanClient {

    @GetMapping("/{id}")
    ApiResponse<LoanAccount> getLoanAccountById(@PathVariable("id") Long id);

    @PutMapping("/{id}/outstanding")
    ApiResponse<LoanAccount> updateOutstandingPrincipal(@PathVariable("id") Long id, @RequestParam("amount") BigDecimal amount);

    @PutMapping("/{id}/status")
    ApiResponse<LoanAccount> updateLoanAccountStatus(@PathVariable("id") Long id, @RequestParam("status") String status);

    @PutMapping("/{id}/dpd")
    ApiResponse<LoanAccount> updateLoanAccountDpd(@PathVariable("id") Long id, @RequestParam("dpd") Integer dpd);
}
