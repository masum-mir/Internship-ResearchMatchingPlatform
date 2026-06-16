package com.ewu.matching.dto.response;

public record ProjectResponse(
        Long id,
        String title,
        String description,
        String link,
        String techStack
) {}
