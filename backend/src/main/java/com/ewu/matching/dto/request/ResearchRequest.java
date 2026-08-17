package com.ewu.matching.dto.request;

import com.ewu.matching.enums.WorkMode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public record ResearchRequest(
        @NotBlank String topic,
        String researchArea,
        String description,
        String eligibility,
        String responsibilities,
        @Valid List<SkillRequest> requiredSkills,
        @DecimalMin("0.0") @DecimalMax("4.0") BigDecimal minCgpa,
        String duration,
        @Positive Integer availablePositions,
        LocalDate applicationDeadline,
        String location,
        WorkMode workMode,
        Boolean funded,
        @DecimalMin("0.0") BigDecimal stipendAmount,
        String stipendCurrency,
        Set<String> targetDepartments
) {}
