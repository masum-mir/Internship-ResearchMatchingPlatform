package com.ewu.matching.dto.request;

import com.ewu.matching.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record ApplicationStatusRequest(
        @NotNull(message = "status is required") ApplicationStatus status
) {}
