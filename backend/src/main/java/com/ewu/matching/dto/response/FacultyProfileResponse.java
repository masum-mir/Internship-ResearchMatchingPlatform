package com.ewu.matching.dto.response;

public record FacultyProfileResponse(
        Long id,
        Long userId,
        String name,
        String department,
        String designation,
        String bio,
        String specialization,
        String researchInterests,
        String contactNumber,
        String university,
        String location,
        String email,
        String profilePicture,
        String coverPicture,
        String googleScholarUrl,
        String orcidId,
        String researchgateUrl,
        String linkedinUrl,
        String universityProfileUrl,
        boolean availableForSupervision
) {}
