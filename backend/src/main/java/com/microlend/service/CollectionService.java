package com.microlend.service;

import com.microlend.dto.request.CollectionRequest;
import com.microlend.entity.CollectionRecord;

import java.util.List;

public interface CollectionService {

    CollectionRecord recordCollection(CollectionRequest req);

    List<CollectionRecord> getAll();

    List<CollectionRecord> getByLoanAccount(Long loanAccountID);

    CollectionRecord getById(Long id);
}