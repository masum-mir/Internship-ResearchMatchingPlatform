package com.ewu.matching.dto.response;

import com.ewu.matching.enums.PostStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public record InternshipResponse(
        Long id,
        String title,
        String description,
        List<SkillResponse> requiredSkills,
        BigDecimal requiredCgpa,
        String location,
        LocalDate deadline,
        Integer vacancies,
        Set<String> targetDepartments,
        PostStatus status,
        LocalDateTime createdAt,
        Long companyId,
        String companyName
) {}
