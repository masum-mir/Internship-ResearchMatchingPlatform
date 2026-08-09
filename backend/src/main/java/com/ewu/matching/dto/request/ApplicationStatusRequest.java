package com.ewu.matching.dto.request;

import com.ewu.matching.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ApplicationStatusRequest(
        @NotNull(message = "status is required") ApplicationStatus status,
        @Size(max = 5000) String reviewerNote
) {}
