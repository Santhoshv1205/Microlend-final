package com.microlend.service.impl;

import com.microlend.client.EmiClient;
import com.microlend.dto.request.DisbursementRequest;
import com.microlend.dto.request.ScheduleGenerationRequest;
import com.microlend.entity.LoanAccount;
import com.microlend.entity.LoanProduct;
import com.microlend.entity.RepaymentSchedule;
import com.microlend.enums.*;
import com.microlend.exception.BadRequestException;
import com.microlend.exception.ResourceNotFoundException;
import com.microlend.repository.*;
import com.microlend.service.LoanDisbursementService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanDisbursementServiceImpl implements LoanDisbursementService {

    private final LoanAccountRepository loanAccountRepository;
    private final LoanApplicationRepository applicationRepository;
    private final LoanProductRepository productRepository;
    private final EmiClient emiClient;

    @Override
    @Transactional
    public LoanAccount disburse(DisbursementRequest req) {

        var application = applicationRepository.findById(req.getApplicationID())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (application.getStatus() != ApplicationStatus.APPROVED) {
            throw new BadRequestException("Only APPROVED applications can be disbursed");
        }

        LoanProduct product = productRepository.findById(application.getLoanProductID())
                .orElseThrow(() -> new ResourceNotFoundException("Loan product not found"));

        BigDecimal principal = req.getDisbursedAmount();
        BigDecimal rate = product.getInterestRatePercent();
        int tenure = product.getTenureMonths();

        BigDecimal totalInterest;
        BigDecimal emi;

        if (product.getInterestType() == InterestType.FLAT) {
            totalInterest = principal.multiply(rate)
                    .multiply(BigDecimal.valueOf(tenure))
                    .divide(BigDecimal.valueOf(1200), 2, RoundingMode.HALF_UP);

            emi = principal.add(totalInterest)
                    .divide(BigDecimal.valueOf(tenure), 2, RoundingMode.HALF_UP);

        } else {
            double monthlyRate = rate.doubleValue() / 1200;

            double emiDouble = principal.doubleValue() * monthlyRate
                    * Math.pow(1 + monthlyRate, tenure)
                    / (Math.pow(1 + monthlyRate, tenure) - 1);

            emi = BigDecimal.valueOf(emiDouble).setScale(2, RoundingMode.HALF_UP);

            totalInterest = emi.multiply(BigDecimal.valueOf(tenure))
                    .subtract(principal)
                    .setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal totalRepayable = principal.add(totalInterest);

        LoanAccount account = LoanAccount.builder()
                .applicationID(req.getApplicationID())
                .borrowerID(application.getBorrowerID())
                .productID(application.getLoanProductID())
                .disbursedAmount(principal)
                .disbursementDate(req.getDisbursementDate() != null
                        ? req.getDisbursementDate() : LocalDate.now())
                .totalInterest(totalInterest)
                .totalRepayable(totalRepayable)
                .outstandingPrincipal(principal)
                .status(LoanAccountStatus.ACTIVE)
                .build();

        LoanAccount saved = loanAccountRepository.save(account);

        application.setStatus(ApplicationStatus.DISBURSED);
        applicationRepository.save(application);

        // Invoke EMI Service to generate schedule
        ScheduleGenerationRequest scheduleReq = ScheduleGenerationRequest.builder()
                .loanAccountID(saved.getLoanAccountID())
                .principal(principal)
                .emi(emi)
                .tenure(tenure)
                .interestRatePercent(product.getInterestRatePercent())
                .interestType(product.getInterestType())
                .disbursementDate(saved.getDisbursementDate())
                .build();

        var emiResponse = emiClient.generateSchedule(scheduleReq);
        if (emiResponse == null || !emiResponse.isSuccess()) {
            throw new BadRequestException("Failed to generate repayment schedule in EMI Service");
        }

        return saved;
    }

    @Override
    public LoanAccount getById(Long id) {
        return loanAccountRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Loan account not found: " + id));
    }

    @Override
    public List<LoanAccount> getAll() {
        return loanAccountRepository.findAll();
    }

    @Override
    public List<LoanAccount> getByBorrower(Long borrowerID) {
        return loanAccountRepository.findByBorrowerID(borrowerID);
    }

    @Override
    public List<RepaymentSchedule> getSchedule(Long loanAccountID) {
        var response = emiClient.getSchedule(loanAccountID);
        if (response != null && response.isSuccess() && response.getData() != null) {
            return response.getData();
        }
        return Collections.emptyList();
    }

    @Override
    @Transactional
    public LoanAccount updateOutstanding(Long id, BigDecimal amount) {
        LoanAccount account = getById(id);
        account.setOutstandingPrincipal(amount);
        return loanAccountRepository.save(account);
    }

    @Override
    @Transactional
    public LoanAccount updateStatus(Long id, LoanAccountStatus status) {
        LoanAccount account = getById(id);
        account.setStatus(status);
        return loanAccountRepository.save(account);
    }

    @Override
    @Transactional
    public LoanAccount updateDpd(Long id, Integer dpd) {
        LoanAccount account = getById(id);
        account.setDpd(dpd);
        return loanAccountRepository.save(account);
    }
}