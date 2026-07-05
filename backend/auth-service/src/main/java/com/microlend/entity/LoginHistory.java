package com.microlend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "login_histories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "login_time", nullable = false)
    private LocalDateTime loginTime;

    @Column(name = "logout_time")
    private LocalDateTime logoutTime;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "browser")
    private String browser;

    @Column(name = "operating_system")
    private String operatingSystem;

    @Column(name = "device")
    private String device;

    @Column(name = "location")
    private String location;

    @Column(name = "authentication_method")
    private String authenticationMethod; // e.g. "PASSWORD_AND_OTP"

    @Column(name = "otp_verification_status")
    private String otpVerificationStatus; // e.g. "VERIFIED", "FAILED", "BLOCKED"
}
