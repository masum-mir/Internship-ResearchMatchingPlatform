package com.ewu.matching.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record PortfolioResponse(
        Long studentId,
        String name,
        String department,
        BigDecimal cgpa,
        String contactNumber,
        List<SkillResponse> skills,
        List<ProjectResponse> projects,
        List<CertificationResponse> certifications
) {}
