package com.microlend.service;

import com.microlend.dto.request.LoanApplicationRequest;
import com.microlend.dto.request.LoanApplicationStatusRequest;
import com.microlend.entity.LoanApplication;
import com.microlend.enums.ApplicationStatus;

import java.util.List;

public interface LoanApplicationService {

    LoanApplication create(LoanApplicationRequest req);

    List<LoanApplication> getAll();

    LoanApplication getById(Long id);

    List<LoanApplication> getByBorrower(Long borrowerID);

    List<LoanApplication> getByStatus(ApplicationStatus status);

    LoanApplication updateStatus(Long id, LoanApplicationStatusRequest req);

    LoanApplication submit(Long id);
}