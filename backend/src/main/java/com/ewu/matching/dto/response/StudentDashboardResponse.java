package com.ewu.matching.dto.response;

public record StudentDashboardResponse(
        long totalApplications,
        long acceptedApplications,
        long rejectedApplications,
        long activeOpportunities
) {}
