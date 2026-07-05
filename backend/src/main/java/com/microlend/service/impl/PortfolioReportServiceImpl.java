package com.microlend.service.impl;

import com.microlend.entity.LoanAccount;
import com.microlend.entity.PortfolioReport;
import com.microlend.enums.LoanAccountStatus;
import com.microlend.enums.ReportScope;
import com.microlend.exception.ResourceNotFoundException;
import com.microlend.repository.DelinquencyCaseRepository;
import com.microlend.repository.LoanAccountRepository;
import com.microlend.repository.PortfolioReportRepository;
import com.microlend.service.PortfolioReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PortfolioReportServiceImpl implements PortfolioReportService {

    private final PortfolioReportRepository reportRepository;
    private final LoanAccountRepository loanAccountRepository;
    private final DelinquencyCaseRepository delinquencyRepository;

    @Override
    public PortfolioReport generate(ReportScope scope, Long scopeRefID) {

        List<LoanAccount> allAccounts = loanAccountRepository.findAll();

        long activeCount = allAccounts.stream()
                .filter(a -> a.getStatus() == LoanAccountStatus.ACTIVE)
                .count();

        BigDecimal totalOutstanding = allAccounts.stream()
                .filter(a -> a.getStatus() == LoanAccountStatus.ACTIVE)
                .map(LoanAccount::getOutstandingPrincipal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal disbursementValue = allAccounts.stream()
                .map(LoanAccount::getDisbursedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long npaCount = allAccounts.stream()
                .filter(a -> a.getStatus() == LoanAccountStatus.NPA)
                .count();

        BigDecimal npaPercent = allAccounts.size() > 0
                ? BigDecimal.valueOf(npaCount * 100.0 / allAccounts.size())
                .setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        PortfolioReport report = PortfolioReport.builder()
                .scope(scope)
                .scopeRefID(scopeRefID)
                .activeLoanCount((int) activeCount)
                .totalOutstanding(totalOutstanding)
                .disbursementValue(disbursementValue)
                .collectionRate(BigDecimal.ZERO)
                .par30(BigDecimal.ZERO)
                .par90(BigDecimal.ZERO)
                .npaPercent(npaPercent)
                .generatedDate(LocalDate.now())
                .build();

        return reportRepository.save(report);
    }

    @Override
    public List<PortfolioReport> getAll() {
        return reportRepository.findAll();
    }

    @Override
    public PortfolioReport getById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Report not found: " + id));
    }
}