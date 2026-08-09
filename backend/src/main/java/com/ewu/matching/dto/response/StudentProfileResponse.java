package com.ewu.matching.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record StudentProfileResponse(
        Long id,
        Long userId,
        String studentId,
        String name,
        String department,
        String batch,
        BigDecimal cgpa,
        String headline,
        String bio,
        String contactNumber,
        String address,
        String profilePicture,
        String coverPicture,
        String university,
        String email,
        String resumeUrl,
        String portfolioUrl,
        String githubUrl,
        String linkedinUrl,
        boolean openToWork,
        List<SkillResponse> skills,
        List<ProjectResponse> projects,
        List<CertificationResponse> certifications
) {}
