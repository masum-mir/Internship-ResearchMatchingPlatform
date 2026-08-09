package com.ewu.matching.service.impl;

import com.ewu.matching.dto.request.CompanyProfileRequest;
import com.ewu.matching.dto.response.CompanyProfileResponse;
import com.ewu.matching.entity.Company;
import com.ewu.matching.mapper.ProfileMapper;
import com.ewu.matching.repository.CompanyRepository;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {
    private final CompanyRepository repository;
    private final CurrentUserProvider currentUser;

    @Override
    @Transactional(readOnly = true)
    public CompanyProfileResponse getMyProfile() {
        return ProfileMapper.toCompanyProfile(currentUser.currentCompany());
    }

    @Override
    @Transactional
    public CompanyProfileResponse updateMyProfile(CompanyProfileRequest r) {
        Company c = currentUser.currentCompany();
        if (r.companyName() != null)
            c.setCompanyName(clean(r.companyName()));
        if (r.description() != null)
            c.setDescription(clean(r.description()));
        if (r.website() != null)
            c.setWebsite(clean(r.website()));
        if (r.location() != null)
            c.setLocation(clean(r.location()));
        if (r.industry() != null)
            c.setIndustry(clean(r.industry()));
        if (r.companySize() != null)
            c.setCompanySize(clean(r.companySize()));
        if (r.foundedDate() != null)
            c.setFoundedDate(r.foundedDate());
        if (r.contactNumber() != null)
            c.setContactNumber(clean(r.contactNumber()));
        if (r.companyEmail() != null)
            c.setCompanyEmail(clean(r.companyEmail()));
        if (r.profilePicture() != null)
            c.setProfilePicture(clean(r.profilePicture()));
        if (r.coverPicture() != null)
            c.setCoverPicture(clean(r.coverPicture()));
        return ProfileMapper.toCompanyProfile(repository.save(c));
    }

    private String clean(String s) {
        if (s == null)
            return null;
        String v = s.trim();
        return v.isEmpty() ? null : v;
    }
}
