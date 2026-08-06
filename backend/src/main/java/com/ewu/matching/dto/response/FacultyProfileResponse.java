package com.ewu.matching.dto.response;

public record FacultyProfileResponse(

        Long id,

        String name,

        String department,

        String designation,

        String bio,

        String specialization,

        String researchInterests,

        String contactNumber,

        String university,

        String email,

        String profilePicture,

        String coverPicture,

        String googleScholarUrl,

        String orcidId,

        String researchgateUrl,

        String linkedinUrl,

        String universityProfileUrl

) {
}