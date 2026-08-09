package com.ewu.matching.dto.response;

import java.time.LocalDate;

public record CompanyProfileResponse(
        Long id,
        Long userId,
        String companyName,
        String description,
        String website,
        String location,
        String industry,
        String companySize,
        LocalDate foundedDate,
        String contactNumber,
        String companyEmail,
        String email,
        String profilePicture,
        String coverPicture,
        boolean verified
) {}
