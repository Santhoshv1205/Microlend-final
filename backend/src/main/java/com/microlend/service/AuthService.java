package com.microlend.service;

import com.microlend.dto.request.LoginRequest;
import com.microlend.dto.request.RegisterUserRequest;
import com.microlend.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterUserRequest request);

    AuthResponse login(LoginRequest request);
}