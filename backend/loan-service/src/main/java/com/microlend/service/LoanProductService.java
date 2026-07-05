package com.microlend.service;

import com.microlend.dto.request.LoanProductRequest;
import com.microlend.entity.LoanProduct;

import java.util.List;

public interface LoanProductService {

    LoanProduct create(LoanProductRequest req);

    List<LoanProduct> getAll();

    LoanProduct getById(Long id);

    LoanProduct update(Long id, LoanProductRequest req);

    void discontinue(Long id);
}