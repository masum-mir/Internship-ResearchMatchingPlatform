package com.ewu.matching.dto.response;

import java.util.List;

/**
 * Transparent breakdown of how the final match score was produced, so the UI
 * can show "why" a score is what it is. All component scores are 0.0 - 1.0;
 * finalScore is the weighted percentage (0 - 100).
 */
public record MatchBreakdownResponse(
        double skillMatch,
        double cgpaMatch,
        double departmentMatch,
        double finalScore,
        List<String> matchedSkills,
        List<String> missingSkills
) {}
