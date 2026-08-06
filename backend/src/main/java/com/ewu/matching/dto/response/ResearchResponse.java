package com.ewu.matching.dto.response;

import com.ewu.matching.enums.PostStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public record ResearchResponse(

        Long id,

        String topic,

        String description,

        String researchArea,

        BigDecimal minCgpa,

        String duration,

        Integer availablePositions,

        LocalDateTime applicationDeadline,

        PostStatus status,

        Long facultyId,

        String facultyName,

        Set<String> targetDepartments,

        List<SkillResponse> requiredSkills,

        LocalDateTime createdAt,

        FacultyProfileResponse faculty

) {
}