package com.ewu.matching.dto.request;

import com.ewu.matching.enums.OpportunityType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ApplicationRequest(
        @NotNull(message = "targetType is required") OpportunityType targetType,
        @NotNull(message = "targetId is required") Long targetId,
        @Size(max = 500) String resumeUrl,
        @Size(max = 10000) String coverLetter,
        @Size(max = 5000) String applicantNote
) {}
