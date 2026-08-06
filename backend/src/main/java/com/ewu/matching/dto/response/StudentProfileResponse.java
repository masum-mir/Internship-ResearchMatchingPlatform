package com.ewu.matching.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record StudentProfileResponse(
        Long id,
        String studentId,
        String name,
        String department,
        BigDecimal cgpa,
        String contactNumber,
        String address,
        String profilePicture,
        String coverPicture,   // <-- ADD
        String email,
        List<SkillResponse> skills,
        List<ProjectResponse> projects,
        List<CertificationResponse> certifications
) {}
