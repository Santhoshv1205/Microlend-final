package com.microlend.service;

import com.microlend.dto.request.DisbursementRequest;
import com.microlend.entity.LoanAccount;
import com.microlend.entity.RepaymentSchedule;

import java.util.List;

public interface LoanDisbursementService {

    LoanAccount disburse(DisbursementRequest req);

    LoanAccount getById(Long id);

    List<LoanAccount> getAll();

    List<LoanAccount> getByBorrower(Long borrowerID);

    List<RepaymentSchedule> getSchedule(Long loanAccountID);
}
