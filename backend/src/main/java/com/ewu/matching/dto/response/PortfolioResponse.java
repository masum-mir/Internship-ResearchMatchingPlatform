package com.ewu.matching.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record PortfolioResponse(
        Long studentId,
        Long userId,
        String studentIdNumber,
        String name,
        String department,
        String batch,
        BigDecimal cgpa,
        String headline,
        String bio,
        String contactNumber,
        String address,
        String profilePicture,
        String resumeUrl,
        String portfolioUrl,
        String githubUrl,
        String linkedinUrl,
        List<SkillResponse> skills,
        List<ProjectResponse> projects,
        List<CertificationResponse> certifications
) {}
