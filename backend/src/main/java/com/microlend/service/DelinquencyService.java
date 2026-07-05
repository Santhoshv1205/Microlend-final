package com.microlend.service;

import com.microlend.dto.request.DelinquencyCaseRequest;
import com.microlend.entity.DelinquencyCase;
import com.microlend.enums.DelinquencyStatus;

import java.util.List;

public interface DelinquencyService {

    DelinquencyCase create(DelinquencyCaseRequest req);

    List<DelinquencyCase> getAll();

    DelinquencyCase getById(Long id);

    DelinquencyCase update(Long id, DelinquencyCaseRequest req);

    List<DelinquencyCase> getByStatus(DelinquencyStatus status);

    List<DelinquencyCase> getByOfficer(Long officerID);

    List<DelinquencyCase> getByLoanAccount(Long loanAccountID);
}