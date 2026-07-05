package com.microlend.service;

import com.microlend.entity.PortfolioReport;
import com.microlend.enums.ReportScope;

import java.util.List;

public interface PortfolioReportService {

    PortfolioReport generate(ReportScope scope, Long scopeRefID);

    List<PortfolioReport> getAll();

    PortfolioReport getById(Long id);
}