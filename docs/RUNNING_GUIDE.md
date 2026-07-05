# Running & Testing Guide

This guide describes how to run and verify the new authentication module.

## Dependencies & Settings
1. **Java Version**: JDK 17 / 21
2. **Database Settings**: Configure connection settings in `config-server/src/main/resources/config/application.properties` or module-specific property files (e.g. `auth-service.properties`):
   - URL: `jdbc:mysql://localhost:3306/microlend_auth?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true`
   - Username: `root` (fallback: `user`)
   - Password: `Sant@1205.`
3. **No Redis**: Ensure no Redis containers are running. MySQL will handle the OTP states natively.

## Boot Order
1. **Discovery Server (Netflix Eureka)**:
   ```bash
   mvn spring-boot:run -pl discovery-server
   ```
2. **Config Server**:
   ```bash
   mvn spring-boot:run -pl config-server
   ```
3. **Functional Services** (Run in any order):
   - `api-gateway`
   - `auth-service`
   - `user-service`
   - `borrower-service`
   - `group-service`
   - `loan-service`
   - `emi-service`
   - `notification-service`
   - `report-service`

## Running Verification Integration Test
A programmtic test client script is provided under `frontend/test-auth.cjs` to simulate the full MFA login, token refresh, and logout flow:
1. Run compilation to ensure all binaries are clean:
   ```bash
   mvn clean compile -DskipTests
   ```
2. Run the integration test inside the `frontend` folder to automatically resolve `axios`:
   ```bash
   node test-auth.cjs
   ```
This test logs into Step 1, extracts the generated OTP from the active logs of `auth-service`, executes Step 2 verification, queries a protected resource with the returned JWT, tests token refreshing, and calls the logout endpoint.
