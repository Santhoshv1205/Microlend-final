package com.microlend.service;

import com.microlend.dto.request.BorrowerKYCRequest;
import com.microlend.entity.BorrowerKYC;
import com.microlend.enums.KYCStatus;

import java.util.List;

public interface BorrowerKYCService {

    BorrowerKYC create(BorrowerKYCRequest req);

    List<BorrowerKYC> getByBorrower(Long borrowerID);

    BorrowerKYC getById(Long id);

    BorrowerKYC updateStatus(Long id, KYCStatus status, Long verifiedByID);

    List<BorrowerKYC> getAll();
}