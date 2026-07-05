package com.microlend.service;

import com.microlend.dto.request.CreditAssessmentRequest;
import com.microlend.entity.CreditAssessment;

import java.util.List;

public interface CreditAssessmentService {

    CreditAssessment create(CreditAssessmentRequest req);

    List<CreditAssessment> getAll();

    CreditAssessment getById(Long id);

    CreditAssessment update(Long id, CreditAssessmentRequest req);
}