package com.ewu.matching.repository;

import com.ewu.matching.entity.CredentialChangeRequest;
import com.ewu.matching.enums.CredentialChangeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CredentialChangeRequestRepository extends JpaRepository<CredentialChangeRequest, Long> {

    List<CredentialChangeRequest> findAllByOrderByCreatedAtDesc();

    List<CredentialChangeRequest> findByStatusOrderByCreatedAtDesc(CredentialChangeStatus status);

    List<CredentialChangeRequest> findByUser_IdOrderByCreatedAtDesc(Long userId);

    boolean existsByUser_IdAndStatus(Long userId, CredentialChangeStatus status);
}
