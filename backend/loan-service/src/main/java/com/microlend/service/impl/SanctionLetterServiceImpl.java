package com.microlend.service.impl;

import com.microlend.dto.request.SanctionLetterRequest;
import com.microlend.entity.SanctionLetter;
import com.microlend.enums.ApplicationStatus;
import com.microlend.enums.SanctionStatus;
import com.microlend.exception.BadRequestException;
import com.microlend.exception.ResourceNotFoundException;
import com.microlend.repository.LoanApplicationRepository;
import com.microlend.repository.SanctionLetterRepository;
import com.microlend.service.SanctionLetterService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SanctionLetterServiceImpl implements SanctionLetterService {

    private final SanctionLetterRepository sanctionRepository;
    private final LoanApplicationRepository applicationRepository;

    @Override
    public SanctionLetter issue(SanctionLetterRequest req) {

        var application = applicationRepository.findById(req.getApplicationID())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Application not found: " + req.getApplicationID()));

        if (application.getStatus() != ApplicationStatus.APPROVED) {
            throw new BadRequestException("Sanction letter only for APPROVED applications");
        }

        SanctionLetter letter = SanctionLetter.builder()
                .applicationID(req.getApplicationID())
                .sanctionedAmount(req.getSanctionedAmount())
                .interestRate(req.getInterestRate())
                .tenure(req.getTenure())
                .emiAmount(req.getEmiAmount())
                .disbursalConditions(req.getDisbursalConditions())
                .issuedDate(LocalDate.now())
                .acceptedByBorrower(false)
                .status(SanctionStatus.ISSUED)
                .build();

        return sanctionRepository.save(letter);
    }

    @Override
    public SanctionLetter accept(Long id) {
        SanctionLetter letter = getById(id);

        if (letter.getStatus() != SanctionStatus.ISSUED) {
            throw new BadRequestException("Only ISSUED letters can be accepted");
        }

        letter.setAcceptedByBorrower(true);
        letter.setStatus(SanctionStatus.ACCEPTED);

        return sanctionRepository.save(letter);
    }

    @Override
    public SanctionLetter getById(Long id) {
        return sanctionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Sanction letter not found: " + id));
    }

    @Override
    public SanctionLetter getByApplicationId(Long applicationID) {
        return sanctionRepository.findAll()
                .stream()
                .filter(s -> s.getApplicationID().equals(applicationID))
                .findFirst()
                .orElseThrow(() ->
                        new ResourceNotFoundException("Not found for application: " + applicationID));
    }

    @Override
    public List<SanctionLetter> getAll() {
        return sanctionRepository.findAll();
    }
}
