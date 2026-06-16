package com.ewu.matching.service.impl;

import com.ewu.matching.dto.response.ChartDataResponse;
import com.ewu.matching.dto.response.ReportResponse;
import com.ewu.matching.enums.ApplicationStatus;
import com.ewu.matching.enums.RoleType;
import com.ewu.matching.repository.ApplicationRepository;
import com.ewu.matching.repository.InternshipRepository;
import com.ewu.matching.repository.SkillRepository;
import com.ewu.matching.repository.UserRepository;
import com.ewu.matching.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final InternshipRepository internshipRepository;
    private final SkillRepository skillRepository;

    @Override
    @Transactional(readOnly = true)
    public ReportResponse getReport() {
        long students = userRepository.countByRoles_Name(RoleType.STUDENT);
        long faculty = userRepository.countByRoles_Name(RoleType.FACULTY);
        long companies = userRepository.countByRoles_Name(RoleType.COMPANY);
        long totalApplications = applicationRepository.count();

        String mostAppliedInternship = resolveMostAppliedInternship();
        String mostPopularSkill = resolveMostPopularSkill();

        ChartDataResponse usersByRole = new ChartDataResponse(
                List.of("Students", "Faculty", "Companies"),
                List.of(students, faculty, companies));

        ChartDataResponse applicationsByStatus = buildApplicationsByStatus();

        return new ReportResponse(students, faculty, companies, totalApplications,
                mostAppliedInternship, mostPopularSkill, usersByRole, applicationsByStatus);
    }

    private String resolveMostAppliedInternship() {
        List<Object[]> rows = applicationRepository.findMostAppliedInternships(PageRequest.of(0, 1));
        if (rows.isEmpty()) return "N/A";
        Long internshipId = (Long) rows.get(0)[0];
        return internshipRepository.findById(internshipId)
                .map(i -> i.getTitle()).orElse("N/A");
    }

    private String resolveMostPopularSkill() {
        List<Object[]> rows = skillRepository.findMostPopularSkills(PageRequest.of(0, 1));
        if (rows.isEmpty()) return "N/A";
        return (String) rows.get(0)[0];
    }

    private ChartDataResponse buildApplicationsByStatus() {
        List<String> labels = new ArrayList<>();
        List<Long> values = new ArrayList<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            labels.add(status.name());
            values.add(applicationRepository.countByStatus(status));
        }
        return new ChartDataResponse(labels, values);
    }
}
