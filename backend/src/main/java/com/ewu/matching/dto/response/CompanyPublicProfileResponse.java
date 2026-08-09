package com.ewu.matching.dto.response;

import java.time.LocalDate;

public record CompanyPublicProfileResponse(
        String companyName,
        String description,
        String website,
        String location,
        String industry,
        String companySize,
        LocalDate foundedDate,
        String contactNumber,
        String companyEmail,
        boolean verified
) {
}