package com.microlend.service;

import com.microlend.dto.request.BorrowerRequest;
import com.microlend.entity.Borrower;
import com.microlend.enums.BorrowerStatus;

import java.util.List;

public interface BorrowerService {

    Borrower create(BorrowerRequest req);

    List<Borrower> getAll();

    Borrower getById(Long id);

    Borrower update(Long id, BorrowerRequest req);

    void delete(Long id);

    List<Borrower> getByStatus(BorrowerStatus status);

    Borrower getByUserID(Long userID);
}