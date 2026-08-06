package com.ewu.matching.mapper;

import com.ewu.matching.dto.response.FacultyProfileResponse;
import com.ewu.matching.dto.response.InternshipResponse;
import com.ewu.matching.dto.response.ResearchResponse;
import com.ewu.matching.entity.Faculty;
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

    public static ResearchResponse toResearchResponse(
            ResearchOpportunity research
    ) {
        if (research == null) {
            return null;
        }

        Faculty faculty = research.getFaculty();

        FacultyProfileResponse facultyProfile =
                faculty != null
                        ? ProfileMapper
                        .toFacultyProfileResponse(
                                faculty
                        )
                        : null;

        return new ResearchResponse(
                research.getId(),
                research.getTopic(),
                research.getDescription(),
                research.getResearchArea(),
                research.getMinCgpa(),
                research.getDuration(),
                research.getAvailablePositions(),
                research.getApplicationDeadline(),
                research.getStatus(),

                faculty != null
                        ? faculty.getId()
                        : null,

                faculty != null
                        ? faculty.getName()
                        : null,

                research.getTargetDepartments(),

                research.getRequiredSkills()
                        .stream()
                        .map(
                                ProfileMapper
                                        ::toSkillResponse
                        )
                        .toList(),

                research.getCreatedAt(),

                facultyProfile
        );
    }
}
