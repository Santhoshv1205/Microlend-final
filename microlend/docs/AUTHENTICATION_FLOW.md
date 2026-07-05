# Authentication Flow Documentation

This document describes the banking-grade 2-step multi-factor authentication (MFA) flow implemented in the MicroLend enterprise microservices application.

## High-Level Flow Chart

```mermaid
sequenceDiagram
    autonumber
    actor Client as Client / React App
    participant GW as API Gateway
    participant Auth as Auth Service
    participant User as User Service
    participant DB as MySQL Database

    Client->>GW: POST /api/auth/login (Email, Password)
    GW->>Auth: Route Request
    Auth->>User: Feign: Get User by Email
    User-->>Auth: User Details & Credentials
    Auth->>Auth: Validate Credentials & Status (BCrypt)
    Auth->>Auth: Generate 6-Digit OTP (SecureRandom)
    Auth->>DB: Save BCrypt Hash of OTP & Metadata
    Auth-->>Client: 200 OK (OTP Sent)

    Client->>GW: POST /api/auth/login/verify (Email, OTP Code)
    GW->>Auth: Route Request
    Auth->>DB: Fetch Active PENDING OTP
    Auth->>Auth: Validate Expiry & Attempt Thresholds
    Auth->>Auth: Match Entered OTP with BCrypt Hash
    Auth->>DB: Update OTP Status to VERIFIED
    Auth->>DB: Log Login Success to Login History
    Auth->>Auth: Generate JWT Access Token (1 Day Expiry)
    Auth->>Auth: Generate Refresh Token (7 Days Expiry)
    Auth->>DB: Save Refresh Token
    Auth-->>Client: 200 OK (JWT Access & Refresh Tokens)
```

## Security Best Practices
- **No JWT on Registration**: JWT tokens are only issued after completing both Password validation and OTP verification.
- **Secure Password Hashing**: Passwords are saved hashed using BCrypt.
- **Secure OTP Hashing**: Plaintext OTP codes are never stored. Only their BCrypt hashes are saved in the database.
- **Zero Redis Dependency**: The application utilizes high-performance MySQL indexing for transactional OTP verification, resolving container overhead and reliability issues.
