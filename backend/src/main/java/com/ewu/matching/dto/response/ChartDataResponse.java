package com.ewu.matching.dto.response;

import java.util.List;

/** Generic label/value series consumed by the frontend pie & bar charts. */
public record ChartDataResponse(
        List<String> labels,
        List<Long> values
) {}
