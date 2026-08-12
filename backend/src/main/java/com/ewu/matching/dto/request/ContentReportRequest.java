package com.ewu.matching.dto.request;

import com.ewu.matching.enums.ReportCategory;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ContentReportRequest(
        @NotNull ReportCategory category,
        @Size(max = 2000) String details
) {}
