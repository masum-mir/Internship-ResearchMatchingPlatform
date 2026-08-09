package com.ewu.matching.dto.response;

import com.ewu.matching.enums.EmploymentType;
import com.ewu.matching.enums.PostStatus;
import com.ewu.matching.enums.WorkMode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public record InternshipResponse(
        Long id,
        String title,
        String description,
        String responsibilities,
        String requirements,
        String benefits,
        List<SkillResponse> requiredSkills,
        BigDecimal requiredCgpa,
        String location,
        WorkMode workMode,
        EmploymentType employmentType,
        BigDecimal salaryMin,
        BigDecimal salaryMax,
        String salaryCurrency,
        String experienceLevel,
        LocalDate deadline,
        Integer vacancies,
        Set<String> targetDepartments,
        PostStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Long companyId,
        Long companyUserId,
        String companyName
) {}
