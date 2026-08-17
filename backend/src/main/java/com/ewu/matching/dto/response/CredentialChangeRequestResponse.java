package com.ewu.matching.dto.response;

import com.ewu.matching.enums.CredentialChangeStatus;

import java.time.LocalDateTime;

public record CredentialChangeRequestResponse(
        Long id,
        Long userId,
        String userEmail,
        String userName,
        String requestedEmail,
        boolean passwordChangeRequested,
        CredentialChangeStatus status,
        LocalDateTime createdAt,
        LocalDateTime resolvedAt
) {}
