package com.ewu.matching.mapper;

import com.ewu.matching.dto.response.InternshipResponse;
import com.ewu.matching.dto.response.ResearchResponse;
import com.ewu.matching.entity.Internship;
import com.ewu.matching.entity.ResearchOpportunity;

import java.util.HashSet;

/** Entity -> response mapping for internships and research opportunities. */
public final class OpportunityMapper {

    private OpportunityMapper() {}

    public static InternshipResponse toInternshipResponse(Internship i) {
        return new InternshipResponse(
                i.getId(),
                i.getTitle(),
                i.getDescription(),
                ProfileMapper.toSkillList(i.getRequiredSkills()),
                i.getRequiredCgpa(),
                i.getLocation(),
                i.getDeadline(),
                i.getVacancies(),
                new HashSet<>(i.getTargetDepartments()),
                i.getStatus(),
                i.getCreatedAt(),
                i.getCompany() != null ? i.getCompany().getId() : null,
                i.getCompany() != null ? i.getCompany().getCompanyName() : null
        );
    }

    public static ResearchResponse toResearchResponse(ResearchOpportunity r) {
        return new ResearchResponse(
                r.getId(),
                r.getTopic(),
                r.getResearchArea(),
                ProfileMapper.toSkillList(r.getRequiredSkills()),
                r.getMinCgpa(),
                r.getDuration(),
                r.getSupervisor(),
                new HashSet<>(r.getTargetDepartments()),
                r.getStatus(),
                r.getCreatedAt(),
                r.getFaculty() != null ? r.getFaculty().getId() : null,
                r.getFaculty() != null ? r.getFaculty().getName() : null
        );
    }
}
