package com.microlend.repository;

import com.microlend.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findFirstByEmailAndStatusOrderByCreatedAtDesc(String email, String status);

    long countByEmailAndCreatedAtAfter(String email, LocalDateTime since);

    @Modifying
    @Transactional
    @Query("DELETE FROM OtpVerification o WHERE o.expiresAt < :now AND o.status = 'PENDING'")
    int deleteExpiredPendingOtps(LocalDateTime now);

    @Modifying
    @Transactional
    @Query("DELETE FROM OtpVerification o WHERE o.status = 'VERIFIED' AND o.verifiedAt < :retentionLimit")
    int deleteOldVerifiedOtps(LocalDateTime retentionLimit);

    @Modifying
    @Transactional
    @Query("DELETE FROM OtpVerification o WHERE o.status = 'BLOCKED' AND o.createdAt < :retentionLimit")
    int deleteOldBlockedOtps(LocalDateTime retentionLimit);
}
