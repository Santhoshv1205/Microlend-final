package com.microlend.service;

import com.microlend.entity.User;
import com.microlend.enums.UserRole;
import com.microlend.enums.UserStatus;

import java.util.List;

public interface UserService {

    List<User> getAll();

    User getById(Long id);

    List<User> getByRole(UserRole role);

    User updateStatus(Long id, UserStatus status);

    void delete(Long id);
}