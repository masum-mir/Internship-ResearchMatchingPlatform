package com.ewu.matching.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ProjectRequest(
        @NotBlank String title,
        String description,
        String link,
        String techStack
) {}
