package com.ewu.matching.dto.response;

import com.ewu.matching.enums.PostStatus;
import com.ewu.matching.enums.WorkMode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public record ResearchResponse(
        Long id,
        String topic,
        String description,
        String researchArea,
        String eligibility,
        String responsibilities,
        BigDecimal minCgpa,
        String duration,
        Integer availablePositions,
        LocalDate applicationDeadline,
        String location,
        WorkMode workMode,
        boolean funded,
        BigDecimal stipendAmount,
        String stipendCurrency,
        PostStatus status,
        Long facultyId,
        Long facultyUserId,
        String facultyName,
        Set<String> targetDepartments,
        List<SkillResponse> requiredSkills,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        FacultyProfileResponse faculty
) {}
