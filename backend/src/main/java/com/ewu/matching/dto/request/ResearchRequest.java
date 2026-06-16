package com.ewu.matching.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

public record ResearchRequest(
        @NotBlank String topic,
        String researchArea,
        @Valid List<SkillRequest> requiredSkills,
        @DecimalMin(value = "0.0") @DecimalMax(value = "4.0") BigDecimal minCgpa,
        String duration,
        String supervisor,
        Set<String> targetDepartments
) {}
