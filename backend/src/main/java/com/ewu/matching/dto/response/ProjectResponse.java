package com.ewu.matching.dto.response;

import java.time.LocalDate;

public record ProjectResponse(
        Long id,
        String title,
        String description,
        String link,
        String repositoryUrl,
        String techStack,
        LocalDate startDate,
        LocalDate endDate
) {}
