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

    private final CompanyRepository companyRepository;
    private final CurrentUserProvider currentUser;

    @Override
    @Transactional(readOnly = true)
    public CompanyProfileResponse getMyProfile() {
        return ProfileMapper.toCompanyProfile(currentUser.currentCompany());
    }

    @Override
    @Transactional
    public CompanyProfileResponse updateMyProfile(CompanyProfileRequest req) {
        Company c = currentUser.currentCompany();
        if (req.companyName() != null) c.setCompanyName(req.companyName());
        if (req.description() != null) c.setDescription(req.description());
        if (req.website() != null) c.setWebsite(req.website());
        if (req.location() != null) c.setLocation(req.location());
        if (req.contactNumber() != null) c.setContactNumber(req.contactNumber());
        if (req.profilePicture() != null) c.setProfilePicture(req.profilePicture());
        if (req.coverPicture() != null) c.setCoverPicture(req.coverPicture());
        return ProfileMapper.toCompanyProfile(companyRepository.save(c));
    }
}
