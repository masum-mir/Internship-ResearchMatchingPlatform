package com.ewu.matching.dto.request;

import jakarta.validation.constraints.Size;

public record FacultyProfileRequest(
        String name,
        String department,
        String designation,
        String bio,
        String specialization,
        String researchInterests,
        String contactNumber,
        String university,
        String profilePicture,
        String coverPicture,
        String googleScholarUrl,
        String orcidId,
        String researchgateUrl,
        String linkedinUrl,
        String universityProfileUrl

) {
}