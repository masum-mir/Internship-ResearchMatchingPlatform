package com.ewu.matching.service;

import com.ewu.matching.dto.request.*;
import com.ewu.matching.dto.response.*;
import java.util.List;

public interface ProfessionalProfileService {
    PublicProfileResponse publicProfile(Long userId);

    List<EducationResponse> education(Long userId);

    List<ExperienceResponse> experience(Long userId);

    EducationResponse addEducation(EducationRequest request);

    EducationResponse updateEducation(Long id, EducationRequest request);

    void deleteEducation(Long id);

    ExperienceResponse addExperience(ExperienceRequest request);

    ExperienceResponse updateExperience(Long id, ExperienceRequest request);

    void deleteExperience(Long id);
}
