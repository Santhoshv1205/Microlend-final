package com.microlend.dto.request;

import com.microlend.enums.InterestType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ScheduleGenerationRequest {
    private Long loanAccountID;
    private BigDecimal principal;
    private BigDecimal emi;
    private int tenure;
    private BigDecimal interestRatePercent;
    private InterestType interestType;
    private LocalDate disbursementDate;
}
