package com.ewu.matching.dto.response;

import com.ewu.matching.enums.SkillCategory;

public record SkillResponse(
        Long id,
        String name,
        SkillCategory category
) {}
