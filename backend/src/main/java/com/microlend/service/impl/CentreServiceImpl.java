package com.microlend.service.impl;

import com.microlend.dto.request.CentreRequest;
import com.microlend.entity.Centre;
import com.microlend.enums.CentreStatus;
import com.microlend.exception.ResourceNotFoundException;
import com.microlend.repository.CentreRepository;
import com.microlend.service.CentreService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CentreServiceImpl implements CentreService {

    private final CentreRepository centreRepository;

    @Override
    public Centre create(CentreRequest req) {
        Centre centre = Centre.builder()
                .centreName(req.getCentreName())
                .branchID(req.getBranchID())
                .fieldOfficerID(req.getFieldOfficerID())
                .village(req.getVillage())
                .meetingDay(req.getMeetingDay())
                .meetingTime(req.getMeetingTime())
                .status(req.getStatus() != null ? req.getStatus() : CentreStatus.ACTIVE)
                .build();

        return centreRepository.save(centre);
    }

    @Override
    public List<Centre> getAll() {
        return centreRepository.findAll();
    }

    @Override
    public Centre getById(Long id) {
        return centreRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Centre not found: " + id));
    }

    @Override
    public Centre update(Long id, CentreRequest req) {
        Centre centre = getById(id);

        centre.setCentreName(req.getCentreName());

        if (req.getFieldOfficerID() != null)
            centre.setFieldOfficerID(req.getFieldOfficerID());

        if (req.getMeetingDay() != null)
            centre.setMeetingDay(req.getMeetingDay());

        if (req.getMeetingTime() != null)
            centre.setMeetingTime(req.getMeetingTime());

        if (req.getStatus() != null)
            centre.setStatus(req.getStatus());

        return centreRepository.save(centre);
    }
}