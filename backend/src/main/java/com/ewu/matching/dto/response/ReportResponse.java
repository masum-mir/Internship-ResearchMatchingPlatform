package com.ewu.matching.dto.response;

public record ReportResponse(
        long totalStudents,
        long totalFaculty,
        long totalCompanies,
        long totalApplications,
        String mostAppliedInternship,
        String mostPopularSkill,
        ChartDataResponse usersByRole,
        ChartDataResponse applicationsByStatus
) {}
