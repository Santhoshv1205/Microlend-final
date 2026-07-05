package com.microlend.service;

import com.microlend.dto.request.CentreRequest;
import com.microlend.entity.Centre;

import java.util.List;

public interface CentreService {

    Centre create(CentreRequest req);

    List<Centre> getAll();

    Centre getById(Long id);

    Centre update(Long id, CentreRequest req);
}