package com.microlend.service;

public interface OtpService {
    void generateAndSendOtp(String email, String ip, String userAgent);
    void verifyOtp(String email, String otpCode);
}
