package com.microlend.service.impl;

import com.microlend.dto.request.DelinquencyCaseRequest;
import com.microlend.entity.DelinquencyCase;
import com.microlend.enums.DelinquencyStatus;
import com.microlend.exception.ResourceNotFoundException;
import com.microlend.repository.DelinquencyCaseRepository;
import com.microlend.service.DelinquencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DelinquencyServiceImpl implements DelinquencyService {

    private final DelinquencyCaseRepository delinquencyRepository;

    @Override
    public DelinquencyCase create(DelinquencyCaseRequest req) {
        DelinquencyCase dc = DelinquencyCase.builder()
                .loanAccountID(req.getLoanAccountID())
                .dpd(req.getDpd())
                .parBucket(req.getParBucket())
                .assignedCollectionsOfficerID(req.getAssignedCollectionsOfficerID())
                .openedDate(LocalDate.now())
                .action(req.getAction())
                .status(req.getStatus() != null ? req.getStatus() : DelinquencyStatus.OPEN)
                .build();

        return delinquencyRepository.save(dc);
    }

    @Override
    public List<DelinquencyCase> getAll() {
        return delinquencyRepository.findAll();
    }

    @Override
    public DelinquencyCase getById(Long id) {
        return delinquencyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Delinquency case not found: " + id));
    }

    @Override
    public DelinquencyCase update(Long id, DelinquencyCaseRequest req) {
        DelinquencyCase dc = getById(id);

        if (req.getDpd() != null) dc.setDpd(req.getDpd());
        if (req.getParBucket() != null) dc.setParBucket(req.getParBucket());
        if (req.getAction() != null) dc.setAction(req.getAction());
        if (req.getStatus() != null) dc.setStatus(req.getStatus());
        if (req.getAssignedCollectionsOfficerID() != null)
            dc.setAssignedCollectionsOfficerID(req.getAssignedCollectionsOfficerID());

        return delinquencyRepository.save(dc);
    }

    @Override
    public List<DelinquencyCase> getByStatus(DelinquencyStatus status) {
        return delinquencyRepository.findByStatus(status);
    }

    @Override
    public List<DelinquencyCase> getByOfficer(Long officerID) {
        return delinquencyRepository.findByAssignedCollectionsOfficerID(officerID);
    }

    @Override
    public List<DelinquencyCase> getByLoanAccount(Long loanAccountID) {
        return delinquencyRepository.findByLoanAccountID(loanAccountID);
    }
}