package com.microlend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp_verifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "purpose")
    private String purpose; // e.g. "LOGIN"

    @Column(name = "otp_hash", nullable = false)
    private String otphash; // BCrypt hash of OTP

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "attempt_count", nullable = false)
    private int attemptCount;

    @Column(name = "max_attempts", nullable = false)
    private int maxAttempts; // default 5

    @Column(name = "status", nullable = false)
    private String status; // "PENDING", "VERIFIED", "BLOCKED", "EXPIRED"

    @Column(name = "last_sent_at")
    private LocalDateTime lastSentAt;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "created_ip")
    private String createdIp;

    @Column(name = "device_information")
    private String deviceInformation;

    @Column(name = "browser_information")
    private String browserInformation;

    @Column(name = "os_information")
    private String osInformation;
}
