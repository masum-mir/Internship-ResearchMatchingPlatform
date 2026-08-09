package com.ewu.matching.mapper;

import com.ewu.matching.dto.response.FacultyProfileResponse;
import com.ewu.matching.dto.response.InternshipResponse;
import com.ewu.matching.dto.response.ResearchResponse;
import com.ewu.matching.entity.Faculty;
import com.ewu.matching.entity.Internship;
import com.ewu.matching.entity.ResearchOpportunity;

import java.util.HashSet;

public final class OpportunityMapper {
    private OpportunityMapper() {}

    public static InternshipResponse toInternshipResponse(Internship i) {
        return new InternshipResponse(
                i.getId(), i.getTitle(), i.getDescription(), i.getResponsibilities(), i.getRequirements(), i.getBenefits(),
                ProfileMapper.toSkillList(i.getRequiredSkills()), i.getRequiredCgpa(), i.getLocation(),
                i.getWorkMode(), i.getEmploymentType(), i.getSalaryMin(), i.getSalaryMax(), i.getSalaryCurrency(),
                i.getExperienceLevel(), i.getDeadline(), i.getVacancies(), new HashSet<>(i.getTargetDepartments()),
                i.getStatus(), i.getCreatedAt(), i.getUpdatedAt(),
                i.getCompany() != null ? i.getCompany().getId() : null,
                i.getCompany() != null && i.getCompany().getUser() != null ? i.getCompany().getUser().getId() : null,
                i.getCompany() != null ? i.getCompany().getCompanyName() : null);
    }

    public static ResearchResponse toResearchResponse(ResearchOpportunity r) {
        if (r == null) return null;
        Faculty f = r.getFaculty();
        FacultyProfileResponse fp = f == null ? null : ProfileMapper.toFacultyProfileResponse(f);
        return new ResearchResponse(
                r.getId(), r.getTopic(), r.getDescription(), r.getResearchArea(), r.getEligibility(), r.getResponsibilities(),
                r.getMinCgpa(), r.getDuration(), r.getAvailablePositions(), r.getApplicationDeadline(), r.getLocation(),
                r.getWorkMode(), r.isFunded(), r.getStipendAmount(), r.getStipendCurrency(), r.getStatus(),
                f != null ? f.getId() : null,
                f != null && f.getUser() != null ? f.getUser().getId() : null,
                f != null ? f.getName() : null,
                r.getTargetDepartments(), ProfileMapper.toSkillList(r.getRequiredSkills()),
                r.getCreatedAt(), r.getUpdatedAt(), fp);
    }
}
