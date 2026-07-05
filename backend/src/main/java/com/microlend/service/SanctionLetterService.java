package com.microlend.service;

import com.microlend.dto.request.SanctionLetterRequest;
import com.microlend.entity.SanctionLetter;

import java.util.List;

public interface SanctionLetterService {

    SanctionLetter issue(SanctionLetterRequest req);

    SanctionLetter accept(Long id);

    SanctionLetter getById(Long id);

    SanctionLetter getByApplicationId(Long applicationID);

    List<SanctionLetter> getAll();
}