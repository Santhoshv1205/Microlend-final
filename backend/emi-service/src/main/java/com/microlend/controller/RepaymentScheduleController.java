package com.microlend.controller;

import com.microlend.dto.request.ScheduleGenerationRequest;
import com.microlend.dto.response.ApiResponse;
import com.microlend.entity.RepaymentSchedule;
import com.microlend.enums.InstallmentStatus;
import com.microlend.repository.RepaymentScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/repayment-schedules")
@RequiredArgsConstructor
public class RepaymentScheduleController {

    private final RepaymentScheduleRepository scheduleRepository;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<Void>> generateSchedule(@RequestBody ScheduleGenerationRequest request) {
        List<RepaymentSchedule> schedules = new ArrayList<>();
        BigDecimal principal = request.getPrincipal();
        BigDecimal emi = request.getEmi();
        int tenure = request.getTenure();
        BigDecimal rate = request.getInterestRatePercent();
        LocalDate disbursementDate = request.getDisbursementDate();

        BigDecimal remainingPrincipal = principal;
        double monthlyRate = rate.doubleValue() / 1200;

        for (int i = 1; i <= tenure; i++) {
            BigDecimal interestDue;
            BigDecimal principalDue;

            if (request.getInterestType() == com.microlend.enums.InterestType.FLAT) {
                BigDecimal totalInterest = principal.multiply(rate)
                        .multiply(BigDecimal.valueOf(tenure))
                        .divide(BigDecimal.valueOf(1200), 2, RoundingMode.HALF_UP);
                interestDue = totalInterest.divide(BigDecimal.valueOf(tenure), 2, RoundingMode.HALF_UP);
                principalDue = emi.subtract(interestDue);
            } else {
                interestDue = remainingPrincipal.multiply(BigDecimal.valueOf(monthlyRate))
                        .setScale(2, RoundingMode.HALF_UP);
                principalDue = emi.subtract(interestDue);

                if (i == tenure) {
                    principalDue = remainingPrincipal;
                    emi = principalDue.add(interestDue);
                }
                remainingPrincipal = remainingPrincipal.subtract(principalDue);
            }

            RepaymentSchedule inst = RepaymentSchedule.builder()
                    .loanAccountID(request.getLoanAccountID())
                    .installmentNumber(i)
                    .dueDate(disbursementDate.plusMonths(i))
                    .principalDue(principalDue)
                    .interestDue(interestDue)
                    .totalDue(emi)
                    .amountPaid(BigDecimal.ZERO)
                    .status(InstallmentStatus.PENDING)
                    .build();

            schedules.add(inst);
        }

        scheduleRepository.saveAll(schedules);
        return ResponseEntity.ok(ApiResponse.success("Repayment schedule generated successfully", null));
    }

    @GetMapping("/{loanAccountID}/schedule")
    public ResponseEntity<ApiResponse<List<RepaymentSchedule>>> getSchedule(@PathVariable Long loanAccountID) {
        List<RepaymentSchedule> schedules = scheduleRepository.findByLoanAccountID(loanAccountID);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }
}
