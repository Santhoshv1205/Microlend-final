# Database Schema Documentation

The new schema introduces two new MySQL tables to support OTP tracking and user session history without requiring Redis.

## Table: `otp_verifications`
This table stores hashed OTP codes, metadata about the request, and verification tracking details.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `BIGINT` | No | Primary Key, Auto-increment. |
| `email` | `VARCHAR(255)` | No | User's email address. |
| `purpose` | `VARCHAR(255)` | Yes | Purpose of OTP (e.g. `LOGIN`). |
| `otp_hash` | `VARCHAR(255)` | No | BCrypt hash of the 6-digit OTP code. |
| `created_at` | `DATETIME(6)` | No | Timestamp when the OTP was generated. |
| `expires_at` | `DATETIME(6)` | No | Timestamp when the OTP expires (5 mins). |
| `attempt_count` | `INT` | No | Number of failed verification attempts. |
| `max_attempts` | `INT` | No | Max attempts allowed (default 5). |
| `status` | `VARCHAR(255)` | No | State of OTP (`PENDING`, `VERIFIED`, `BLOCKED`, `EXPIRED`). |
| `last_sent_at` | `DATETIME(6)` | Yes | Timestamp of last SMS/Email transmission. |
| `verified_at` | `DATETIME(6)` | Yes | Timestamp when successfully verified. |
| `created_ip` | `VARCHAR(255)` | Yes | Client IP address that requested the OTP. |
| `device_information` | `VARCHAR(255)` | Yes | Parsed device classification (e.g. `Desktop`, `Mobile`). |
| `browser_information` | `VARCHAR(255)` | Yes | Parsed browser type (e.g. `Chrome`, `Firefox`). |
| `os_information` | `VARCHAR(255)` | Yes | Parsed client operating system (e.g. `Windows`, `macOS`). |

## Table: `login_histories`
Logs authentication sessions for audits.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `BIGINT` | No | Primary Key, Auto-increment. |
| `email` | `VARCHAR(255)` | No | User's email address. |
| `login_time` | `DATETIME(6)` | No | Timestamp of successful login (step 2). |
| `logout_time` | `DATETIME(6)` | Yes | Timestamp when the user logged out. |
| `ip_address` | `VARCHAR(255)` | Yes | Client IP address. |
| `browser` | `VARCHAR(255)` | Yes | Browser name. |
| `operating_system` | `VARCHAR(255)` | Yes | OS name. |
| `device` | `VARCHAR(255)` | Yes | Device category. |
| `authentication_method` | `VARCHAR(255)` | Yes | MFA mechanism used (e.g., `PASSWORD_AND_OTP`). |
| `otp_verification_status`| `VARCHAR(255)` | Yes | OTP verification status (`VERIFIED`). |
