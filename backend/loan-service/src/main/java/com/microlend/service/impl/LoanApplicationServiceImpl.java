package com.microlend.service.impl;

import com.microlend.dto.request.LoanApplicationRequest;
import com.microlend.dto.request.LoanApplicationStatusRequest;
import com.microlend.entity.LoanApplication;
import com.microlend.enums.ApplicationStatus;
import com.microlend.exception.BadRequestException;
import com.microlend.exception.ResourceNotFoundException;
import com.microlend.repository.LoanApplicationRepository;
import com.microlend.service.LoanApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanApplicationServiceImpl implements LoanApplicationService {

    private final LoanApplicationRepository applicationRepository;

    @Override
    public LoanApplication create(LoanApplicationRequest req) {
        LoanApplication application = LoanApplication.builder()
                .borrowerID(req.getBorrowerID())
                .groupID(req.getGroupID())
                .loanProductID(req.getLoanProductID())
                .requestedAmount(req.getRequestedAmount())
                .purpose(req.getPurpose())
                .applicationDate(LocalDate.now())
                .creditOfficerID(req.getCreditOfficerID())
                .status(ApplicationStatus.DRAFT)
                .build();

        return applicationRepository.save(application);
    }

    @Override
    public List<LoanApplication> getAll() {
        return applicationRepository.findAll();
    }

    @Override
    public LoanApplication getById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Loan application not found: " + id));
    }

    @Override
    public List<LoanApplication> getByBorrower(Long borrowerID) {
        return applicationRepository.findByBorrowerID(borrowerID);
    }

    @Override
    public List<LoanApplication> getByStatus(ApplicationStatus status) {
        return applicationRepository.findByStatus(status);
    }

    @Override
    public LoanApplication updateStatus(Long id, LoanApplicationStatusRequest req) {
        LoanApplication app = getById(id);
        validateStatusTransition(app.getStatus(), req.getStatus());
        app.setStatus(req.getStatus());
        return applicationRepository.save(app);
    }

    @Override
    public LoanApplication submit(Long id) {
        LoanApplication app = getById(id);

        if (app.getStatus() != ApplicationStatus.DRAFT) {
            throw new BadRequestException("Only DRAFT applications can be submitted");
        }

        app.setStatus(ApplicationStatus.SUBMITTED);
        return applicationRepository.save(app);
    }

    private void validateStatusTransition(ApplicationStatus current, ApplicationStatus next) {
        boolean valid = switch (current) {
            case DRAFT -> next == ApplicationStatus.SUBMITTED;
            case SUBMITTED -> next == ApplicationStatus.UNDER_REVIEW;
            case UNDER_REVIEW -> next == ApplicationStatus.APPROVED || next == ApplicationStatus.REJECTED;
            case APPROVED -> next == ApplicationStatus.DISBURSED;
            default -> false;
        };

        if (!valid) {
            throw new BadRequestException(
                    "Invalid status transition from " + current + " to " + next);
        }
    }
}