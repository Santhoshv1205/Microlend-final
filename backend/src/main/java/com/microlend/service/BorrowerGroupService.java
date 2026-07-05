package com.microlend.service;

import com.microlend.dto.request.BorrowerGroupRequest;
import com.microlend.entity.BorrowerGroup;

import java.util.List;

public interface BorrowerGroupService {

    BorrowerGroup create(BorrowerGroupRequest req);

    List<BorrowerGroup> getAll();

    BorrowerGroup getById(Long id);

    BorrowerGroup update(Long id, BorrowerGroupRequest req);

    List<BorrowerGroup> getByCentre(Long centreID);
}