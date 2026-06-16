package com.ewu.matching.dto.request;

import com.ewu.matching.enums.SkillCategory;
import jakarta.validation.constraints.NotBlank;

public record SkillRequest(
        @NotBlank String name,
        SkillCategory category
) {}
