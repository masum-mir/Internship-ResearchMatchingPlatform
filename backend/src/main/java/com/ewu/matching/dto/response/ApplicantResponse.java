package com.ewu.matching.dto.response;

import com.ewu.matching.enums.ApplicationStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Company/Faculty-facing view of an applicant in their inbox (sortable by matchScore). */
public record ApplicantResponse(
        Long applicationId,
        ApplicationStatus status,
        Double matchScore,
        LocalDateTime appliedAt,
        Long studentId,
        String studentName,
        String studentIdNumber,
        String department,
        BigDecimal cgpa
) {}
