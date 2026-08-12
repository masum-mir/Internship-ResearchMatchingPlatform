package com.ewu.matching.dto.response;

import com.ewu.matching.enums.ApplicationStatus;
import com.ewu.matching.enums.OpportunityType;
import java.time.LocalDateTime;

public record ApplicationResponse(
        Long id,
        OpportunityType targetType,
        Long opportunityId,
        String opportunityTitle,
        ApplicationStatus status,
        Double matchScore,
        String resumeUrl,
        String coverLetter,
        String applicantNote,
        String reviewerNote,
        String withdrawalReason,
        LocalDateTime appliedAt,
        LocalDateTime updatedAt,
        LocalDateTime reviewedAt,
        LocalDateTime withdrawnAt
) {}
