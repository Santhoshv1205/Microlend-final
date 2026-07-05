package com.microlend.controller;

import com.microlend.dto.request.LoginRequest;
import com.microlend.dto.request.RegisterUserRequest;
import com.microlend.dto.request.TokenRefreshRequest;
import com.microlend.dto.request.VerifyOtpRequest;
import com.microlend.dto.response.ApiResponse;
import com.microlend.dto.response.AuthResponse;
import com.microlend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/login — Public endpoint. Login Step 1: validates credentials and generates OTP.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> loginStep1(@Valid @RequestBody LoginRequest request, jakarta.servlet.http.HttpServletRequest servletRequest) {
        authService.loginStep1(request, servletRequest);
        return ResponseEntity.ok(ApiResponse.success("OTP sent successfully to " + request.getEmail(), null));
    }

    /**
     * POST /api/auth/login/verify — Public endpoint. Login Step 2: verifies OTP and returns JWT and Refresh Token.
     */
    @PostMapping("/login/verify")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request, jakarta.servlet.http.HttpServletRequest servletRequest) {
        AuthResponse response = authService.verifyOtpAndLogin(request, servletRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    /**
     * POST /api/auth/logout — Revokes the active refresh token and logs the logout event.
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(jakarta.servlet.http.HttpServletRequest servletRequest) {
        authService.logout(servletRequest);
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }

    /**
     * POST /api/auth/refresh — Public endpoint. Refreshes the expired access token using refresh token.
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshAccessToken(@Valid @RequestBody TokenRefreshRequest request) {
        AuthResponse response = authService.refreshAccessToken(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    /**
     * POST /api/auth/register — PROTECTED: requires ADMIN or BRANCH_MANAGER.
     * Registers a new user. Returns "Registration Successful", no JWT.
     */
    @PostMapping("/register")
    @PreAuthorize("hasAnyRole('ADMIN', 'BRANCH_MANAGER')")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterUserRequest request) {
        try {
            authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Registration Successful", null));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
