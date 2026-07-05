package com.microlend.service.impl;

import com.microlend.dto.request.CollectionRequest;
import com.microlend.entity.CollectionRecord;
import com.microlend.entity.LoanAccount;
import com.microlend.entity.RepaymentSchedule;
import com.microlend.enums.CollectionStatus;
import com.microlend.enums.InstallmentStatus;
import com.microlend.enums.LoanAccountStatus;
import com.microlend.exception.BadRequestException;
import com.microlend.exception.ResourceNotFoundException;
import com.microlend.repository.CollectionRecordRepository;
import com.microlend.repository.LoanAccountRepository;
import com.microlend.repository.RepaymentScheduleRepository;
import com.microlend.service.CollectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CollectionServiceImpl implements CollectionService {

    private final CollectionRecordRepository collectionRepository;
    private final RepaymentScheduleRepository scheduleRepository;
    private final LoanAccountRepository loanAccountRepository;

    @Override
    @Transactional
    public CollectionRecord recordCollection(CollectionRequest req) {

        LoanAccount account = loanAccountRepository.findById(req.getLoanAccountID())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Loan account not found: " + req.getLoanAccountID()));

        if (account.getStatus() == LoanAccountStatus.CLOSED) {
            throw new BadRequestException("Loan account is already closed");
        }

        if (req.getCollectedAmount() == null ||
                req.getCollectedAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Collected amount must be greater than zero");
        }

        CollectionStatus collectionStatus = CollectionStatus.RECEIVED;

        if (req.getScheduleID() != null) {

            RepaymentSchedule schedule = scheduleRepository.findById(req.getScheduleID())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Schedule not found: " + req.getScheduleID()));

            BigDecimal alreadyPaid = schedule.getAmountPaid() != null
                    ? schedule.getAmountPaid() : BigDecimal.ZERO;

            BigDecimal remainingDue = schedule.getTotalDue().subtract(alreadyPaid);

            int cmp = req.getCollectedAmount().compareTo(remainingDue);

            if (cmp >= 0) {
                // FULL PAYMENT
                schedule.setStatus(InstallmentStatus.PAID);
                schedule.setAmountPaid(schedule.getTotalDue());
                schedule.setPaidDate(LocalDate.now());

                collectionStatus = cmp > 0
                        ? CollectionStatus.EXCESS
                        : CollectionStatus.RECEIVED;

            } else {
                // PARTIAL PAYMENT ✅
                BigDecimal newTotalPaid = alreadyPaid.add(req.getCollectedAmount());

                schedule.setAmountPaid(newTotalPaid);
                schedule.setStatus(InstallmentStatus.PARTIAL);

                collectionStatus = CollectionStatus.PARTIAL;
            }

            scheduleRepository.save(schedule);
        }

        // Reduce principal
        account.setOutstandingPrincipal(
                account.getOutstandingPrincipal()
                        .subtract(req.getCollectedAmount())
                        .max(BigDecimal.ZERO)
        );

        if (account.getOutstandingPrincipal().compareTo(BigDecimal.ZERO) == 0) {
            account.setStatus(LoanAccountStatus.CLOSED);
        }

        loanAccountRepository.save(account);

        CollectionRecord record = CollectionRecord.builder()
                .loanAccountID(req.getLoanAccountID())
                .scheduleID(req.getScheduleID())
                .collectedAmount(req.getCollectedAmount())
                .collectionDate(req.getCollectionDate() != null
                        ? req.getCollectionDate() : LocalDate.now())
                .collectedByID(req.getCollectedByID())
                .mode(req.getMode())
                .status(collectionStatus)
                .build();

        return collectionRepository.save(record);
    }

    @Override
    public List<CollectionRecord> getAll() {
        return collectionRepository.findAll();
    }

    @Override
    public List<CollectionRecord> getByLoanAccount(Long loanAccountID) {
        return collectionRepository.findByLoanAccountID(loanAccountID);
    }

    @Override
    public CollectionRecord getById(Long id) {
        return collectionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Collection record not found: " + id));
    }
}