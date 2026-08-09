package com.ewu.matching.service.impl;

import com.ewu.matching.dto.request.FacultyProfileRequest;
import com.ewu.matching.dto.response.FacultyProfileResponse;
import com.ewu.matching.entity.Faculty;
import com.ewu.matching.mapper.ProfileMapper;
import com.ewu.matching.repository.FacultyRepository;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.FacultyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FacultyServiceImpl implements FacultyService {
    private final FacultyRepository repository;
    private final CurrentUserProvider currentUser;

    @Override
    @Transactional(readOnly = true)
    public FacultyProfileResponse getMyProfile() {
        return ProfileMapper.toFacultyProfileResponse(currentUser.currentFaculty());
    }

    @Override
    @Transactional
    public FacultyProfileResponse updateMyProfile(FacultyProfileRequest r) {
        Faculty f = currentUser.currentFaculty();
        if (r.name() != null)
            f.setName(clean(r.name()));
        if (r.department() != null)
            f.setDepartment(clean(r.department()));
        if (r.designation() != null)
            f.setDesignation(clean(r.designation()));
        if (r.bio() != null)
            f.setBio(clean(r.bio()));
        if (r.specialization() != null)
            f.setSpecialization(clean(r.specialization()));
        if (r.researchInterests() != null)
            f.setResearchInterests(clean(r.researchInterests()));
        if (r.contactNumber() != null)
            f.setContactNumber(clean(r.contactNumber()));
        if (r.university() != null)
            f.setUniversity(clean(r.university()));
        if (r.location() != null)
            f.setLocation(clean(r.location()));
        if (r.profilePicture() != null)
            f.setProfilePicture(clean(r.profilePicture()));
        if (r.coverPicture() != null)
            f.setCoverPicture(clean(r.coverPicture()));
        if (r.googleScholarUrl() != null)
            f.setGoogleScholarUrl(clean(r.googleScholarUrl()));
        if (r.orcidId() != null)
            f.setOrcidId(clean(r.orcidId()));
        if (r.researchgateUrl() != null)
            f.setResearchgateUrl(clean(r.researchgateUrl()));
        if (r.linkedinUrl() != null)
            f.setLinkedinUrl(clean(r.linkedinUrl()));
        if (r.universityProfileUrl() != null)
            f.setUniversityProfileUrl(clean(r.universityProfileUrl()));
        if (r.availableForSupervision() != null)
            f.setAvailableForSupervision(r.availableForSupervision());
        return ProfileMapper.toFacultyProfileResponse(repository.save(f));
    }

    private String clean(String s) {
        if (s == null)
            return null;
        String v = s.trim();
        return v.isEmpty() ? null : v;
    }
}
