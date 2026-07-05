package com.microlend.service.impl;

import com.microlend.entity.OtpVerification;
import com.microlend.exception.BadRequestException;
import com.microlend.repository.OtpVerificationRepository;
import com.microlend.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpServiceImpl implements OtpService {

    private final OtpVerificationRepository otpVerificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom random = new SecureRandom();

    @Value("${app.otp.limit.hourly:5}")
    private int hourlyLimit;

    @Value("${app.otp.limit.daily:20}")
    private int dailyLimit;

    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;
    private static final int MAX_ATTEMPTS = 5;

    @Override
    @Transactional
    public void generateAndSendOtp(String email, String ip, String userAgent) {
        LocalDateTime now = LocalDateTime.now();

        // 1. Rate Limiting check: Cooldown (60 seconds)
        Optional<OtpVerification> activeOtpOpt = otpVerificationRepository
                .findFirstByEmailAndStatusOrderByCreatedAtDesc(email, "PENDING");

        if (activeOtpOpt.isPresent()) {
            OtpVerification activeOtp = activeOtpOpt.get();
            if (activeOtp.getCreatedAt().plusSeconds(RESEND_COOLDOWN_SECONDS).isAfter(now)) {
                throw new BadRequestException("Please wait " + RESEND_COOLDOWN_SECONDS + " seconds before requesting a new OTP.");
            }
            // Invalidate the previous active OTP
            activeOtp.setStatus("EXPIRED");
            otpVerificationRepository.save(activeOtp);
            log.info("Invalidated previous pending OTP for user: {}", email);
        }

        // 2. Rate Limiting check: Hourly & Daily limits
        LocalDateTime oneHourAgo = now.minusHours(1);
        long requestsLastHour = otpVerificationRepository.countByEmailAndCreatedAtAfter(email, oneHourAgo);
        if (requestsLastHour >= hourlyLimit) {
            throw new BadRequestException("Too many OTP requests in the last hour. Limit is " + hourlyLimit);
        }

        LocalDateTime oneDayAgo = now.minusDays(1);
        long requestsLastDay = otpVerificationRepository.countByEmailAndCreatedAtAfter(email, oneDayAgo);
        if (requestsLastDay >= dailyLimit) {
            throw new BadRequestException("Too many OTP requests in the last 24 hours. Limit is " + dailyLimit);
        }

        // 3. Generate 6 digit secure random OTP
        String code = String.format("%06d", random.nextInt(1000000));
        String hashedCode = passwordEncoder.encode(code);

        // 4. Save metadata to MySQL
        OtpVerification otp = OtpVerification.builder()
                .email(email)
                .purpose("LOGIN")
                .otphash(hashedCode)
                .createdAt(now)
                .expiresAt(now.plusMinutes(OTP_EXPIRY_MINUTES))
                .attemptCount(0)
                .maxAttempts(MAX_ATTEMPTS)
                .status("PENDING")
                .lastSentAt(now)
                .createdIp(ip)
                .deviceInformation(extractDevice(userAgent))
                .browserInformation(extractBrowser(userAgent))
                .osInformation(extractOs(userAgent))
                .build();

        otpVerificationRepository.save(otp);
        log.info("[MySQL] Saved hashed OTP for user: {}", email);

        // 5. Send OTP: Log/print to stdout so the tester/user can see it
        System.out.println("\n========================================================");
        System.out.println("   OTP FOR: " + email);
        System.out.println("   CODE IS: " + code);
        System.out.println("   (Expires in " + OTP_EXPIRY_MINUTES + " minutes)");
        System.out.println("========================================================\n");
    }

    @Override
    @Transactional
    public void verifyOtp(String email, String otpCode) {
        LocalDateTime now = LocalDateTime.now();

        // 1. Fetch latest pending OTP
        OtpVerification record = otpVerificationRepository
                .findFirstByEmailAndStatusOrderByCreatedAtDesc(email, "PENDING")
                .orElseThrow(() -> new BadRequestException("OTP expired or not found. Please request a new OTP."));

        // 2. Check if expired
        if (record.getExpiresAt().isBefore(now)) {
            record.setStatus("EXPIRED");
            otpVerificationRepository.save(record);
            throw new BadRequestException("OTP expired or not found. Please request a new OTP.");
        }

        // 3. Check if attempts exceeded
        if (record.getAttemptCount() >= record.getMaxAttempts()) {
            record.setStatus("BLOCKED");
            otpVerificationRepository.save(record);
            throw new BadRequestException("Maximum attempts exceeded. Please request a new OTP.");
        }

        // 4. BCrypt match
        if (!passwordEncoder.matches(otpCode, record.getOtphash())) {
            int newAttempts = record.getAttemptCount() + 1;
            record.setAttemptCount(newAttempts);

            if (newAttempts >= record.getMaxAttempts()) {
                record.setStatus("BLOCKED");
                otpVerificationRepository.save(record);
                throw new BadRequestException("Maximum attempts exceeded. Please request a new OTP.");
            }

            otpVerificationRepository.save(record);
            throw new BadRequestException("Invalid OTP. Remaining attempts: " + (record.getMaxAttempts() - newAttempts));
        }

        // 5. Success
        record.setStatus("VERIFIED");
        record.setVerifiedAt(now);
        otpVerificationRepository.save(record);
        log.info("[MySQL] OTP verified successfully for user: {}", email);
    }

    private String extractOs(String userAgent) {
        if (userAgent == null) return "Unknown";
        if (userAgent.contains("Windows")) return "Windows";
        if (userAgent.contains("Macintosh") || userAgent.contains("Mac OS")) return "macOS";
        if (userAgent.contains("Android")) return "Android";
        if (userAgent.contains("iPhone") || userAgent.contains("iPad")) return "iOS";
        if (userAgent.contains("Linux")) return "Linux";
        return "Unknown";
    }

    private String extractBrowser(String userAgent) {
        if (userAgent == null) return "Unknown";
        if (userAgent.contains("Edge") || userAgent.contains("Edg")) return "Edge";
        if (userAgent.contains("Chrome") && !userAgent.contains("Chromium")) return "Chrome";
        if (userAgent.contains("Safari") && !userAgent.contains("Chrome")) return "Safari";
        if (userAgent.contains("Firefox")) return "Firefox";
        if (userAgent.contains("MSIE") || userAgent.contains("Trident")) return "Internet Explorer";
        return "Other";
    }

    private String extractDevice(String userAgent) {
        if (userAgent == null) return "Unknown";
        if (userAgent.contains("Mobi")) return "Mobile";
        if (userAgent.contains("Tablet") || userAgent.contains("iPad")) return "Tablet";
        return "Desktop";
    }
}
