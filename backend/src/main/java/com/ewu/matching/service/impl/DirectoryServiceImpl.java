package com.ewu.matching.service.impl;

import com.ewu.matching.dto.response.ProfileSummaryResponse;
import com.ewu.matching.entity.*;
import com.ewu.matching.repository.*;
import com.ewu.matching.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DirectoryServiceImpl implements DirectoryService {
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final CompanyRepository companyRepository;
    private final ProfileLookupService profileLookup;

    @Override
    @Transactional(readOnly = true)
    public List<ProfileSummaryResponse> search(String query) {
        if (query == null || query.isBlank())
            return List.of();
        String q = query.trim();
        LinkedHashMap<Long, ProfileSummaryResponse> r = new LinkedHashMap<>();
        studentRepository.findTop20ByNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(q, q)
                .forEach(x -> r.put(x.getUser().getId(), profileLookup.summary(x.getUser())));
        facultyRepository.findTop20ByNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(q, q)
                .forEach(x -> r.put(x.getUser().getId(), profileLookup.summary(x.getUser())));
        companyRepository.findTop20ByCompanyNameContainingIgnoreCaseOrIndustryContainingIgnoreCase(q, q)
                .forEach(x -> r.put(x.getUser().getId(), profileLookup.summary(x.getUser())));
        return r.values().stream().limit(50).toList();
    }
}
