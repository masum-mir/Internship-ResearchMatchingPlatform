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

    private final FacultyRepository facultyRepository;
    private final CurrentUserProvider currentUser;

    @Override
    @Transactional(readOnly = true)
    public FacultyProfileResponse getMyProfile() {
        return ProfileMapper.toFacultyProfile(currentUser.currentFaculty());
    }

    @Override
    @Transactional
    public FacultyProfileResponse updateMyProfile(FacultyProfileRequest req) {
        Faculty f = currentUser.currentFaculty();
        if (req.name() != null) f.setName(req.name());
        if (req.department() != null) f.setDepartment(req.department());
        if (req.designation() != null) f.setDesignation(req.designation());
        if (req.contactNumber() != null) f.setContactNumber(req.contactNumber());
        return ProfileMapper.toFacultyProfile(facultyRepository.save(f));
    }
}
