package com.microlend.service;

import com.microlend.dto.request.LoginRequest;
import com.microlend.dto.request.RegisterUserRequest;
import com.microlend.dto.response.AuthResponse;

import com.microlend.dto.request.TokenRefreshRequest;
import com.microlend.dto.request.VerifyOtpRequest;

public interface AuthService {

    void register(RegisterUserRequest request);

    void loginStep1(LoginRequest request, jakarta.servlet.http.HttpServletRequest servletRequest);

    AuthResponse verifyOtpAndLogin(VerifyOtpRequest request, jakarta.servlet.http.HttpServletRequest servletRequest);

    AuthResponse refreshAccessToken(TokenRefreshRequest request);

    void logout(jakarta.servlet.http.HttpServletRequest servletRequest);
}