package com.ewu.matching.dto.request;

import com.ewu.matching.enums.EmploymentType;
import com.ewu.matching.enums.WorkMode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public record InternshipRequest(
        @NotBlank String title,
        String description,
        String responsibilities,
        String requirements,
        String benefits,
        @Valid List<SkillRequest> requiredSkills,
        @DecimalMin("0.0") @DecimalMax("4.0") BigDecimal requiredCgpa,
        String location,
        WorkMode workMode,
        EmploymentType employmentType,
        @DecimalMin("0.0") BigDecimal salaryMin,
        @DecimalMin("0.0") BigDecimal salaryMax,
        String salaryCurrency,
        String experienceLevel,
        LocalDate deadline,
        @Positive(message = "Vacancies must be greater than zero") Integer vacancies,
        Set<String> targetDepartments
) {}
