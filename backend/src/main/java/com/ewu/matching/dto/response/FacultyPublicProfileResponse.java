package com.ewu.matching.dto.response;

public record FacultyPublicProfileResponse(
        String university,
        String department,
        String designation,
        String specialization,
        String researchInterests,
        String contactNumber,
        String location,
        String googleScholarUrl,
        String orcidId,
        String researchgateUrl,
        String linkedinUrl,
        String universityProfileUrl,
        boolean availableForSupervision
) {
}