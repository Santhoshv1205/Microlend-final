# OTP Login Flow & Protection Controls

This document details the rate limiting, attempt control, and expiration mechanisms implemented in the OTP login workflow.

## OTP Security Requirements
1. **Length**: Exactly 6 digits generated using cryptographically secure `java.security.SecureRandom`.
2. **Expiry**: 5 minutes (`expires_at` is set to `created_at + 5 minutes`).
3. **Single-Use**: OTP becomes `VERIFIED` and unusable after its first successful verification.
4. **Active Limit**: Only one active OTP is allowed per user. Requesting a new OTP automatically marks the previous pending OTP as `EXPIRED`.
5. **Cooldown**: Users must wait **60 seconds** between consecutive OTP requests.
6. **Attempt Limit**: Maximum of **5 failed verification attempts** are permitted per OTP. If exceeded, the OTP status is set to `BLOCKED`.

## Rate Limiting Thresholds
To prevent brute-force attacks and abuse of the OTP endpoint, the system checks the history of generated OTP requests:
- **Hourly Limit**: Configurable limit of **5 OTP requests per hour** (e.g. `app.otp.limit.hourly=5`).
- **Daily Limit**: Configurable limit of **20 OTP requests per 24 hours** (e.g. `app.otp.limit.daily=20`).

If either threshold is exceeded, a `BadRequestException` is thrown, and the request is rejected.
