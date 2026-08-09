package com.ewu.matching.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record ProjectRequest(
        @NotBlank String title,
        String description,
        String link,
        String repositoryUrl,
        String techStack,
        LocalDate startDate,
        LocalDate endDate
) {}
