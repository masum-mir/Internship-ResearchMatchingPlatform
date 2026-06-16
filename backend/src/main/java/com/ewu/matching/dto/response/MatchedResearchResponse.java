package com.ewu.matching.dto.response;

public record MatchedResearchResponse(
        ResearchResponse research,
        MatchBreakdownResponse match
) {}
