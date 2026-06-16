package com.ewu.matching.dto.request;

import com.ewu.matching.enums.OpportunityType;
import jakarta.validation.constraints.NotNull;

public record BookmarkRequest(
        @NotNull(message = "targetType is required") OpportunityType targetType,
        @NotNull(message = "targetId is required") Long targetId
) {}
