package com.ewu.matching.dto.response;

public record MatchedInternshipResponse(
        InternshipResponse internship,
        MatchBreakdownResponse match
) {}
