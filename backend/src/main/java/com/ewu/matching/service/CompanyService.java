package com.ewu.matching.service;

import com.ewu.matching.dto.request.CompanyProfileRequest;
import com.ewu.matching.dto.response.CompanyProfileResponse;

public interface CompanyService {
    CompanyProfileResponse getMyProfile();
    CompanyProfileResponse updateMyProfile(CompanyProfileRequest request);
}
