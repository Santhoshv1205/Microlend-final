package com.microlend.service.impl;

import com.microlend.dto.request.BorrowerRequest;
import com.microlend.entity.Borrower;
import com.microlend.entity.User;
import com.microlend.enums.BorrowerStatus;
import com.microlend.enums.UserRole;
import com.microlend.exception.BadRequestException;
import com.microlend.exception.ResourceNotFoundException;
import com.microlend.repository.BorrowerRepository;
import com.microlend.repository.UserRepository;
import com.microlend.service.BorrowerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BorrowerServiceImpl implements BorrowerService {

    private final BorrowerRepository borrowerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Borrower create(BorrowerRequest req) {

        if (req.getNationalIDNumber() != null &&
                borrowerRepository.findByNationalIDNumber(req.getNationalIDNumber()).isPresent()) {
            throw new BadRequestException("Borrower with National ID already exists");
        }

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email already used: " + req.getEmail());
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(UserRole.BORROWER)
                .phone(req.getPhone())
                .build();

        User savedUser = userRepository.save(user);

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
                .user(savedUser)
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
    public void delete(Long id) {
        Borrower borrower = getById(id);

        if (borrower.getUser() != null) {
            userRepository.deleteById(borrower.getUser().getUserID());
        }

        borrowerRepository.deleteById(id);
    }

    @Override
    public List<Borrower> getByStatus(BorrowerStatus status) {
        return borrowerRepository.findByStatus(status);
    }

    @Override
    public Borrower getByUserID(Long userID) {
        return borrowerRepository.findAll()
                .stream()
                .filter(b -> b.getUser() != null &&
                        b.getUser().getUserID().equals(userID))
                .findFirst()
                .orElseThrow(() ->
                        new ResourceNotFoundException("Borrower not found for userID: " + userID));
    }
}
