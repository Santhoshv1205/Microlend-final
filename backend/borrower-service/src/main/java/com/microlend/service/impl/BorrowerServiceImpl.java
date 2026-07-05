package com.microlend.service.impl;

import com.microlend.client.UserClient;
import com.microlend.dto.request.BorrowerRequest;
import com.microlend.dto.request.RegisterUserRequest;
import com.microlend.entity.Borrower;
import com.microlend.entity.User;
import com.microlend.enums.BorrowerStatus;
import com.microlend.enums.UserRole;
import com.microlend.exception.BadRequestException;
import com.microlend.exception.ResourceNotFoundException;
import com.microlend.repository.BorrowerRepository;
import com.microlend.service.BorrowerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BorrowerServiceImpl implements BorrowerService {

    private final BorrowerRepository borrowerRepository;
    private final UserClient userClient;

    @Override
    @Transactional
    public Borrower create(BorrowerRequest req) {

        if (req.getNationalIDNumber() != null &&
                borrowerRepository.findByNationalIDNumber(req.getNationalIDNumber()).isPresent()) {
            throw new BadRequestException("Borrower with National ID already exists");
        }

        // Validate if email is already taken in user-service
        var checkUser = userClient.getUserByEmail(req.getEmail());
        if (checkUser != null && checkUser.isSuccess() && checkUser.getData() != null) {
            throw new BadRequestException("Email already used: " + req.getEmail());
        }

        RegisterUserRequest userRegRequest = new RegisterUserRequest();
        userRegRequest.setName(req.getName());
        userRegRequest.setEmail(req.getEmail());
        userRegRequest.setPassword(req.getPassword());
        userRegRequest.setRole(UserRole.BORROWER);
        userRegRequest.setPhone(req.getPhone());

        var response = userClient.registerUserInternal(userRegRequest);
        if (response == null || !response.isSuccess() || response.getData() == null) {
            throw new BadRequestException("Failed to register associated user login: " + (response != null ? response.getMessage() : "Unknown error"));
        }

        User savedUser = response.getData();

        Borrower borrower = Borrower.builder()
                .name(req.getName())
                .dateOfBirth(req.getDateOfBirth())
                .gender(req.getGender())
                .nationalIDNumber(req.getNationalIDNumber())
                .village(req.getVillage())
                .district(req.getDistrict())
                .phone(req.getPhone())
                .occupation(req.getOccupation())
                .monthlyIncome(req.getMonthlyIncome())
                .bankAccountNumber(req.getBankAccountNumber())
                .status(req.getStatus() != null ? req.getStatus() : BorrowerStatus.ACTIVE)
                .userID(savedUser.getUserID())
                .build();

        return borrowerRepository.save(borrower);
    }

    @Override
    public List<Borrower> getAll() {
        return borrowerRepository.findAll();
    }

    @Override
    public Borrower getById(Long id) {
        return borrowerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Borrower not found with ID: " + id));
    }

    @Override
    public Borrower update(Long id, BorrowerRequest req) {
        Borrower borrower = getById(id);

        borrower.setName(req.getName());

        if (req.getDateOfBirth() != null) borrower.setDateOfBirth(req.getDateOfBirth());
        if (req.getGender() != null) borrower.setGender(req.getGender());
        if (req.getVillage() != null) borrower.setVillage(req.getVillage());
        if (req.getDistrict() != null) borrower.setDistrict(req.getDistrict());
        if (req.getPhone() != null) borrower.setPhone(req.getPhone());
        if (req.getOccupation() != null) borrower.setOccupation(req.getOccupation());
        if (req.getMonthlyIncome() != null) borrower.setMonthlyIncome(req.getMonthlyIncome());
        if (req.getBankAccountNumber() != null) borrower.setBankAccountNumber(req.getBankAccountNumber());
        if (req.getStatus() != null) borrower.setStatus(req.getStatus());

        return borrowerRepository.save(borrower);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Borrower borrower = getById(id);

        if (borrower.getUserID() != null) {
            // Delete associated user in user-service via Feign or Rest template.
            // In User service UserController, we have: DELETE /api/admin/users/{id}
            // Let's add deleteUser to UserClient!
            try {
                userClient.deleteUser(borrower.getUserID());
            } catch (Exception e) {
                // If it fails, log and continue or throw exception.
            }
        }

        borrowerRepository.deleteById(id);
    }

    @Override
    public List<Borrower> getByStatus(BorrowerStatus status) {
        return borrowerRepository.findByStatus(status);
    }

    @Override
    public Borrower getByUserID(Long userID) {
        return borrowerRepository.findByUserID(userID)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Borrower not found for userID: " + userID));
    }
}
