package com.ewu.matching.dto.response;

import com.ewu.matching.enums.ApplicationStatus;
import com.ewu.matching.enums.OpportunityType;

import java.time.LocalDateTime;

/** Student-facing view of their own application. */
public record ApplicationResponse(
        Long id,
        OpportunityType targetType,
        Long opportunityId,
        String opportunityTitle,
        ApplicationStatus status,
        Double matchScore,
        LocalDateTime appliedAt
) {}
