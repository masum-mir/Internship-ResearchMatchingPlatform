package com.ewu.matching.dto.request;

import java.time.LocalDate;

public record CompanyProfileRequest(
        String companyName,
        String description,
        String website,
        String location,
        String industry,
        String companySize,
        LocalDate foundedDate,
        String contactNumber,
        String companyEmail,
        String profilePicture,
        String coverPicture
) {}
