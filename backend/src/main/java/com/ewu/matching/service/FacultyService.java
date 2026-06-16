package com.ewu.matching.service;

import com.ewu.matching.dto.request.FacultyProfileRequest;
import com.ewu.matching.dto.response.FacultyProfileResponse;

public interface FacultyService {
    FacultyProfileResponse getMyProfile();
    FacultyProfileResponse updateMyProfile(FacultyProfileRequest request);
}
