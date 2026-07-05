package com.microlend.service.impl;

import com.microlend.entity.User;
import com.microlend.enums.UserRole;
import com.microlend.enums.UserStatus;
import com.microlend.exception.ResourceNotFoundException;
import com.microlend.repository.UserRepository;
import com.microlend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Override
    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found: " + id));
    }

    @Override
    public List<User> getByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    @Override
    public User updateStatus(Long id, UserStatus status) {
        User user = getById(id);
        user.setStatus(status);
        return userRepository.save(user);
    }

    @Override
    public void delete(Long id) {
        getById(id);
        userRepository.deleteById(id);
    }

    @Override
    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    @Override
    public User createUser(com.microlend.dto.request.RegisterUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new com.microlend.exception.BadRequestException("Email already registered: " + request.getEmail());
        }
        User user = User.builder()
                .name(request.getName())
                .role(request.getRole())
                .email(request.getEmail())
                .password(request.getPassword())
                .phone(request.getPhone())
                .branchID(request.getBranchID())
                .status(UserStatus.ACTIVE)
                .build();
        return userRepository.save(user);
    }
}
