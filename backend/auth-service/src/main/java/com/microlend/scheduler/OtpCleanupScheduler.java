package com.microlend.scheduler;

import com.microlend.repository.OtpVerificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class OtpCleanupScheduler {

    private final OtpVerificationRepository otpVerificationRepository;

    @Value("${app.otp.retention.hours:24}")
    private int retentionHours;

    /**
     * Runs every hour at the top of the hour.
     */
    @Scheduled(cron = "0 0 * * * *")
    public void cleanupOtps() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime retentionLimit = now.minusHours(retentionHours);

        log.info("[Scheduler] Starting OTP verification records cleanup task...");

        try {
            int expiredCount = otpVerificationRepository.deleteExpiredPendingOtps(now);
            int verifiedCount = otpVerificationRepository.deleteOldVerifiedOtps(retentionLimit);
            int blockedCount = otpVerificationRepository.deleteOldBlockedOtps(retentionLimit);

            log.info("[Scheduler] Cleanup task completed. Expired deleted: {}, Verified deleted: {}, Blocked deleted: {}",
                    expiredCount, verifiedCount, blockedCount);
        } catch (Exception e) {
            log.error("[Scheduler] Failed to clean up OTP verification records: {}", e.getMessage(), e);
        }
    }
}
