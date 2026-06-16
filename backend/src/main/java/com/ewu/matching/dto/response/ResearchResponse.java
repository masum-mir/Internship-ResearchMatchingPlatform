package com.ewu.matching.dto.response;

import com.ewu.matching.enums.PostStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public record ResearchResponse(
        Long id,
        String topic,
        String researchArea,
        List<SkillResponse> requiredSkills,
        BigDecimal minCgpa,
        String duration,
        String supervisor,
        Set<String> targetDepartments,
        PostStatus status,
        LocalDateTime createdAt,
        Long facultyId,
        String facultyName
) {}
