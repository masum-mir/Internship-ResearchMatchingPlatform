package com.ewu.matching.dto.response;

public record CompanyProfileResponse(
        Long id,
        String companyName,
        String description,
        String website,
        String location,
        String contactNumber,
        String email,
        String profilePicture,
        String coverPicture
) {}
