package com.ewu.matching.dto.response;

import com.ewu.matching.enums.ApplicationStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ApplicantResponse(
        Long applicationId,
        ApplicationStatus status,
        Double matchScore,
        LocalDateTime appliedAt,
        Long studentId,
        Long studentUserId,
        String studentName,
        String studentIdNumber,
        String department,
        BigDecimal cgpa,
        String headline,
        String resumeUrl,
        String coverLetter,
        String applicantNote,
        String reviewerNote
) {}
