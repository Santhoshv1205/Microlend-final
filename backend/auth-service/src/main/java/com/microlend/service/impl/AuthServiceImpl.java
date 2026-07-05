package com.microlend.service.impl;

import com.microlend.client.UserClient;
import com.microlend.dto.request.LoginRequest;
import com.microlend.dto.request.RegisterUserRequest;
import com.microlend.dto.request.TokenRefreshRequest;
import com.microlend.dto.request.VerifyOtpRequest;
import com.microlend.dto.response.AuthResponse;
import com.microlend.entity.RefreshToken;
import com.microlend.entity.User;
import com.microlend.entity.LoginHistory;
import com.microlend.enums.UserRole;
import com.microlend.enums.UserStatus;
import com.microlend.exception.BadRequestException;
import com.microlend.repository.RefreshTokenRepository;
import com.microlend.repository.LoginHistoryRepository;
import com.microlend.security.JwtUtil;
import com.microlend.service.AuthService;
import com.microlend.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserClient userClient;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final LoginHistoryRepository loginHistoryRepository;

    private static final List<UserRole> MANAGER_PROVISIONABLE_ROLES = List.of(
            UserRole.FIELD_OFFICER,
            UserRole.CREDIT_OFFICER,
            UserRole.COLLECTIONS_OFFICER
    );

    @Override
    public void register(RegisterUserRequest request) {
        // Enforce password encryption before sending to user-service
        request.setPassword(passwordEncoder.encode(request.getPassword()));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isManager = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_BRANCH_MANAGER"));

        if (isManager) {
            validateBranchManagerProvisioning(auth, request);
        }

        var response = userClient.registerUserInternal(request);
        if (response == null || !response.isSuccess() || response.getData() == null) {
            throw new BadRequestException("Registration failed: " + (response != null ? response.getMessage() : "Unknown error"));
        }
    }

    private void validateBranchManagerProvisioning(Authentication auth, RegisterUserRequest request) {
        if (!MANAGER_PROVISIONABLE_ROLES.contains(request.getRole())) {
            throw new SecurityException(
                    "BRANCH_MANAGER is not authorized to create role: " + request.getRole());
        }

        var callerResponse = userClient.getUserByEmail(auth.getName());
        if (callerResponse == null || !callerResponse.isSuccess() || callerResponse.getData() == null) {
            throw new BadRequestException("Authenticated user not found");
        }
        User caller = callerResponse.getData();

        if (caller.getBranchID() == null) {
            throw new SecurityException("BRANCH_MANAGER has no branch assignment.");
        }

        if (!caller.getBranchID().equals(request.getBranchID())) {
            throw new SecurityException("Cannot create user in another branch");
        }
    }

    @Override
    public void loginStep1(LoginRequest request, jakarta.servlet.http.HttpServletRequest servletRequest) {
        var userResponse = userClient.getUserByEmail(request.getEmail());
        if (userResponse == null || !userResponse.isSuccess() || userResponse.getData() == null) {
            throw new BadRequestException("Invalid credentials");
        }
        User user = userResponse.getData();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new BadRequestException("Your account is suspended.");
        }

        // Generate and send OTP via MySQL
        String ip = getClientIp(servletRequest);
        String userAgent = servletRequest.getHeader("User-Agent");
        otpService.generateAndSendOtp(request.getEmail(), ip, userAgent);
    }

    @Override
    @Transactional
    public AuthResponse verifyOtpAndLogin(VerifyOtpRequest request, jakarta.servlet.http.HttpServletRequest servletRequest) {
        // 1. Verify OTP first
        otpService.verifyOtp(request.getEmail(), request.getOtpCode());

        // 2. Fetch User
        var userResponse = userClient.getUserByEmail(request.getEmail());
        if (userResponse == null || !userResponse.isSuccess() || userResponse.getData() == null) {
            throw new BadRequestException("User not found");
        }
        User user = userResponse.getData();

        // 3. Generate Access Token (JWT)
        String accessToken = jwtUtil.generateToken(user);

        // 4. Generate & Save Refresh Token
        refreshTokenRepository.deleteByUsername(user.getEmail());
        String refreshStr = UUID.randomUUID().toString();
        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .token(refreshStr)
                .username(user.getEmail())
                .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .build();
        refreshTokenRepository.save(refreshTokenEntity);

        // 5. Record Login History
        String userAgent = servletRequest.getHeader("User-Agent");
        LoginHistory history = LoginHistory.builder()
                .email(user.getEmail())
                .loginTime(LocalDateTime.now())
                .ipAddress(getClientIp(servletRequest))
                .browser(extractBrowser(userAgent))
                .operatingSystem(extractOs(userAgent))
                .device(extractDevice(userAgent))
                .authenticationMethod("PASSWORD_AND_OTP")
                .otpVerificationStatus("VERIFIED")
                .build();
        loginHistoryRepository.save(history);

        return AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshStr)
                .userID(user.getUserID())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .branchID(user.getBranchID())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshAccessToken(TokenRefreshRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new BadRequestException("Expired refresh token. Please sign in again.");
        }

        var userResponse = userClient.getUserByEmail(refreshToken.getUsername());
        if (userResponse == null || !userResponse.isSuccess() || userResponse.getData() == null) {
            throw new BadRequestException("User not found");
        }
        User user = userResponse.getData();

        String newAccessToken = jwtUtil.generateToken(user);

        return AuthResponse.builder()
                .token(newAccessToken)
                .refreshToken(refreshToken.getToken())
                .userID(user.getUserID())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .branchID(user.getBranchID())
                .build();
    }

    @Override
    @Transactional
    public void logout(jakarta.servlet.http.HttpServletRequest servletRequest) {
        String email = null;
        String authHeader = servletRequest.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                email = jwtUtil.extractUsername(token);
            } catch (Exception e) {
                // Token could be malformed or expired
            }
        }

        if (email == null) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
                email = auth.getName();
            }
        }

        if (email != null) {
            // Delete Refresh Tokens
            refreshTokenRepository.deleteByUsername(email);

            // Update Login History with logout time
            Optional<LoginHistory> historyOpt = loginHistoryRepository.findFirstByEmailOrderByLoginTimeDesc(email);
            if (historyOpt.isPresent()) {
                LoginHistory history = historyOpt.get();
                if (history.getLogoutTime() == null) {
                    history.setLogoutTime(LocalDateTime.now());
                    loginHistoryRepository.save(history);
                }
            }
        }
    }

    private String getClientIp(jakarta.servlet.http.HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isEmpty()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
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
