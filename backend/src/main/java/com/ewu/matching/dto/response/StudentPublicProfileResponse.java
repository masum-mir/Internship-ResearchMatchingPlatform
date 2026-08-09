package com.ewu.matching.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record StudentPublicProfileResponse(
        String studentId,
        String university,
        String department,
        String batch,
        BigDecimal cgpa,
        String contactNumber,
        String address,
        String resumeUrl,
        String portfolioUrl,
        String githubUrl,
        String linkedinUrl,
        boolean openToWork,
        List<SkillResponse> skills,
        List<ProjectResponse> projects,
        List<CertificationResponse> certifications
) {
}