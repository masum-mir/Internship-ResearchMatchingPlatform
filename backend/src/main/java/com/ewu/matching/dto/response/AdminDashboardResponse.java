package com.ewu.matching.dto.response;

public record AdminDashboardResponse(
        long totalUsers,
        long totalPosts,
        long totalApplications
) {}
