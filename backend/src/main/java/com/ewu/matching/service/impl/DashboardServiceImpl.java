package com.ewu.matching.service.impl;

import com.ewu.matching.dto.response.*;
import com.ewu.matching.enums.ApplicationStatus;
import com.ewu.matching.enums.PostStatus;
import com.ewu.matching.repository.*;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ApplicationRepository applicationRepository;
    private final InternshipRepository internshipRepository;
    private final ResearchOpportunityRepository researchRepository;
    private final UserRepository userRepository;
    private final CurrentUserProvider currentUser;

    @Override
    @Transactional(readOnly = true)
    public StudentDashboardResponse studentDashboard() {
        Long sid = currentUser.currentStudent().getId();
        long total = applicationRepository.countByStudent_Id(sid);
        long accepted = applicationRepository.countByStudent_IdAndStatus(sid, ApplicationStatus.ACCEPTED);
        long rejected = applicationRepository.countByStudent_IdAndStatus(sid, ApplicationStatus.REJECTED);
        long active = internshipRepository.countByStatus(PostStatus.ACTIVE)
                + researchRepository.countByStatus(PostStatus.ACTIVE);
        return new StudentDashboardResponse(total, accepted, rejected, active);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyDashboardResponse companyDashboard() {
        Long cid = currentUser.currentCompany().getId();
        return new CompanyDashboardResponse(
                internshipRepository.countByCompany_Id(cid),
                applicationRepository.countByInternship_Company_Id(cid));
    }

    @Override
    @Transactional(readOnly = true)
    public FacultyDashboardResponse facultyDashboard() {
        Long fid = currentUser.currentFaculty().getId();
        return new FacultyDashboardResponse(
                researchRepository.countByFaculty_Id(fid),
                applicationRepository.countByResearch_Faculty_Id(fid));
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse adminDashboard() {
        long totalPosts = internshipRepository.count() + researchRepository.count();
        return new AdminDashboardResponse(
                userRepository.count(), totalPosts, applicationRepository.count());
    }
}
