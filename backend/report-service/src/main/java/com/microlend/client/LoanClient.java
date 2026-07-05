package com.microlend.client;

import com.microlend.dto.response.ApiResponse;
import com.microlend.entity.LoanAccount;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "loan-service", path = "/api/loan-accounts")
public interface LoanClient {

    @GetMapping
    ApiResponse<List<LoanAccount>> getAllLoans();
}
