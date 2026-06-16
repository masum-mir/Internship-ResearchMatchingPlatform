package com.ewu.matching.dto.response;

import com.ewu.matching.enums.OpportunityType;

import java.time.LocalDateTime;

public record BookmarkResponse(
        Long id,
        OpportunityType targetType,
        Long opportunityId,
        String opportunityTitle,
        LocalDateTime createdAt
) {}
