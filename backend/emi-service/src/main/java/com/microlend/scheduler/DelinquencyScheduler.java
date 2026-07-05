package com.microlend.scheduler;

import com.microlend.client.AuditClient;
import com.microlend.client.LoanClient;
import com.microlend.entity.DelinquencyCase;
import com.microlend.entity.LoanAccount;
import com.microlend.entity.RepaymentSchedule;
import com.microlend.enums.DelinquencyStatus;
import com.microlend.enums.InstallmentStatus;
import com.microlend.enums.LoanAccountStatus;
import com.microlend.enums.PARBucket;
import com.microlend.repository.DelinquencyCaseRepository;
import com.microlend.repository.RepaymentScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DelinquencyScheduler {

    private final RepaymentScheduleRepository scheduleRepository;
    private final DelinquencyCaseRepository delinquencyRepository;
    private final LoanClient loanClient;
    private final AuditClient auditClient;

    /**
     * Nightly delinquency engine — runs at 00:30 AM every day.
     */
    @Scheduled(cron = "0 30 0 * * *")
    @Transactional
    public void runNightlyDelinquencyCheck() {
        LocalDate today = LocalDate.now();
        log.info("[DelinquencyEngine] Starting nightly run for date: {}", today);

        int overdueMarked = 0;
        int casesCreated = 0;
        int casesUpdated = 0;

        List<RepaymentSchedule> overdueInstallments =
                scheduleRepository.findOverdueInstallments(today);

        log.info("[DelinquencyEngine] Found {} overdue installment(s).",
                overdueInstallments.size());

        for (RepaymentSchedule installment : overdueInstallments) {
            try {
                var response = loanClient.getLoanAccountById(installment.getLoanAccountID());
                if (response == null || !response.isSuccess() || response.getData() == null) {
                    continue;
                }
                LoanAccount account = response.getData();

                // Step 2: Mark installment as OVERDUE
                if (installment.getStatus() != InstallmentStatus.OVERDUE) {
                    installment.setStatus(InstallmentStatus.OVERDUE);
                    scheduleRepository.save(installment);
                    overdueMarked++;
                }

                // Step 3: Calculate DPD
                long daysOverdue = ChronoUnit.DAYS.between(installment.getDueDate(), today);

                // Step 4: Update account DPD
                if (daysOverdue > (account.getDpd() != null ? account.getDpd() : 0)) {
                    loanClient.updateLoanAccountDpd(account.getLoanAccountID(), (int) daysOverdue);
                }

                // Step 5: Mark NPA if DPD >= 90
                if (daysOverdue >= 90
                        && account.getStatus() == LoanAccountStatus.ACTIVE) {
                    loanClient.updateLoanAccountStatus(account.getLoanAccountID(), LoanAccountStatus.NPA.name());
                    log.warn("[DelinquencyEngine] Account {} → NPA. DPD: {}",
                            account.getLoanAccountID(), daysOverdue);
                }

                // Step 6: Classify PAR bucket
                PARBucket bucket = classifyPARBucket(daysOverdue);

                // Step 7: Create or update DelinquencyCase
                Optional<DelinquencyCase> existing = delinquencyRepository
                        .findByLoanAccountIDAndStatus(
                                account.getLoanAccountID(), DelinquencyStatus.OPEN);

                if (existing.isPresent()) {
                    DelinquencyCase dc = existing.get();
                    dc.setDpd((int) daysOverdue);
                    dc.setParBucket(bucket);
                    delinquencyRepository.save(dc);
                    casesUpdated++;
                    log.debug("[DelinquencyEngine] Updated case {} | Account {} | DPD {} | {}",
                            dc.getDelinquencyID(), account.getLoanAccountID(), daysOverdue, bucket);
                } else {
                    DelinquencyCase newCase = DelinquencyCase.builder()
                            .loanAccountID(account.getLoanAccountID())
                            .dpd((int) daysOverdue)
                            .parBucket(bucket)
                            .openedDate(today)
                            .status(DelinquencyStatus.OPEN)
                            .build();
                    delinquencyRepository.save(newCase);
                    casesCreated++;

                    log.info("[DelinquencyEngine] New case | Account {} | DPD {} | {}",
                            account.getLoanAccountID(), daysOverdue, bucket);

                    // Step 8: Audit entry in User Service
                    try {
                        auditClient.logActivity(0L, "AUTO_CREATE_DELINQUENCY_CASE", "DELINQUENCY");
                    } catch (Exception ae) {
                        log.error("[DelinquencyEngine] Failed to write audit entry in user-service: {}", ae.getMessage());
                    }
                }

            } catch (Exception e) {
                log.error("[DelinquencyEngine] Error processing schedule ID {}: {}",
                        installment.getScheduleID(), e.getMessage(), e);
            }
        }

        log.info("[DelinquencyEngine] Nightly run complete. " +
                "OVERDUE marked: {} | Cases created: {} | Cases updated: {}",
                overdueMarked, casesCreated, casesUpdated);
    }

    private PARBucket classifyPARBucket(long daysOverdue) {
        if (daysOverdue >= 180) return PARBucket.PAR180;
        if (daysOverdue >= 90)  return PARBucket.PAR90;
        if (daysOverdue >= 60)  return PARBucket.PAR60;
        return PARBucket.PAR30;
    }

    public void triggerManualRun() {
        log.info("[DelinquencyEngine] Manual trigger initiated.");
        runNightlyDelinquencyCheck();
    }
}