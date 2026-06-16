package com.ewu.matching.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public record InternshipRequest(
        @NotBlank String title,
        String description,
        @Valid List<SkillRequest> requiredSkills,
        @DecimalMin(value = "0.0") @DecimalMax(value = "4.0") BigDecimal requiredCgpa,
        String location,
        LocalDate deadline,
        @Positive(message = "Vacancies must be greater than zero") Integer vacancies,
        Set<String> targetDepartments
) {}
