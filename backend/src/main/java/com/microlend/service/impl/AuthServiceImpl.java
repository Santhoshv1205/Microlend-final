package com.microlend.service.impl;

import com.microlend.dto.request.LoginRequest;
import com.microlend.dto.request.RegisterUserRequest;
import com.microlend.dto.response.AuthResponse;
import com.microlend.entity.User;
import com.microlend.enums.UserRole;
import com.microlend.exception.BadRequestException;
import com.microlend.repository.UserRepository;
import com.microlend.security.JwtUtil;
import com.microlend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    private static final List<UserRole> MANAGER_PROVISIONABLE_ROLES = List.of(
            UserRole.FIELD_OFFICER,
            UserRole.CREDIT_OFFICER,
            UserRole.COLLECTIONS_OFFICER
    );

    @Override
    public AuthResponse register(RegisterUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isManager = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_BRANCH_MANAGER"));

        if (isManager) {
            validateBranchManagerProvisioning(auth, request);
        }

        User user = User.builder()
                .name(request.getName())
                .role(request.getRole())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .branchID(request.getBranchID())
                .build();

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved);

        return AuthResponse.builder()
                .token(token)
                .userID(saved.getUserID())
                .name(saved.getName())
                .email(saved.getEmail())
                .role(saved.getRole())
                .branchID(saved.getBranchID())
                .build();
    }

    private void validateBranchManagerProvisioning(Authentication auth,
                                                   RegisterUserRequest request) {

        if (!MANAGER_PROVISIONABLE_ROLES.contains(request.getRole())) {
            throw new SecurityException(
                    "BRANCH_MANAGER is not authorized to create role: " + request.getRole());
        }

        User caller = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new BadRequestException("Authenticated user not found"));

        if (caller.getBranchID() == null) {
            throw new SecurityException("BRANCH_MANAGER has no branch assignment.");
        }

        if (!caller.getBranchID().equals(request.getBranchID())) {
            throw new SecurityException("Cannot create user in another branch");
        }
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String token = jwtUtil.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .userID(user.getUserID())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .branchID(user.getBranchID())
                .build();
    }
}