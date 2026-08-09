package com.ewu.matching.service.impl;

import com.ewu.matching.dto.response.ProfileSummaryResponse;
import com.ewu.matching.entity.*;
import com.ewu.matching.exception.ResourceNotFoundException;
import com.ewu.matching.repository.*;
import com.ewu.matching.service.ProfileLookupService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProfileLookupServiceImpl implements ProfileLookupService {
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final CompanyRepository companyRepository;

    @Override
    public ProfileSummaryResponse summary(Long userId) {
        return summary(userRepository.findById(userId).orElseThrow(() -> ResourceNotFoundException.of("User", userId)));
    }

    @Override
    public ProfileSummaryResponse summary(User u) {
        Student s = studentRepository.findByUser_Id(u.getId()).orElse(null);
        if (s != null)
            return new ProfileSummaryResponse(u.getId(), "STUDENT", s.getName(), s.getHeadline(),
                    s.getProfilePicture(), s.getAddress(), s.getDepartment());
        Faculty f = facultyRepository.findByUser_Id(u.getId()).orElse(null);
        if (f != null)
            return new ProfileSummaryResponse(u.getId(), "FACULTY", f.getName(), f.getDesignation(),
                    f.getProfilePicture(), f.getLocation(), f.getUniversity());
        Company c = companyRepository.findByUser_Id(u.getId()).orElse(null);
        if (c != null)
            return new ProfileSummaryResponse(u.getId(), "COMPANY", c.getCompanyName(), c.getIndustry(),
                    c.getProfilePicture(), c.getLocation(), c.getCompanyName());
        return new ProfileSummaryResponse(u.getId(), "ADMIN", u.getEmail(), "Administrator", null, null, null);
    }

    @Override
    public String displayName(User user) {
        return summary(user).name();
    }

    @Override
    public String profilePicture(User user) {
        return summary(user).profilePicture();
    }

    @Override
    public String role(User user) {
        return summary(user).role();
    }
}
