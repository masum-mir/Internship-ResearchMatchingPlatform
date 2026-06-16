package com.ewu.matching.dto.request;

public record CompanyProfileRequest(
        String companyName,
        String description,
        String website,
        String location,
        String contactNumber
) {}
