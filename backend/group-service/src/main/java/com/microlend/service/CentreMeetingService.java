package com.microlend.service;

import com.microlend.dto.request.CentreMeetingRequest;
import com.microlend.entity.CentreMeeting;

import java.util.List;

public interface CentreMeetingService {

    CentreMeeting create(CentreMeetingRequest req);

    List<CentreMeeting> getAll();

    CentreMeeting getById(Long id);

    CentreMeeting update(Long id, CentreMeetingRequest req);

    List<CentreMeeting> getByCentre(Long centreID);
}