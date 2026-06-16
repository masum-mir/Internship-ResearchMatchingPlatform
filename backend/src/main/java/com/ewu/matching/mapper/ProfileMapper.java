package com.ewu.matching.mapper;

import com.ewu.matching.dto.response.*;
import com.ewu.matching.entity.*;

import java.util.List;

/** Pure entity -> response mapping for users, profiles, skills, projects, certifications. */
public final class ProfileMapper {

    private ProfileMapper() {}

    public static UserResponse toUserResponse(User u) {
        return new UserResponse(
                u.getId(),
                u.getEmail(),
                u.getRoles().stream().map(Role::getName).collect(java.util.stream.Collectors.toSet()),
                u.isEnabled(),
                u.isBlocked(),
                u.getCreatedAt()
        );
    }

    public static SkillResponse toSkillResponse(Skill s) {
        return new SkillResponse(s.getId(), s.getName(), s.getCategory());
    }

    public static ProjectResponse toProjectResponse(Project p) {
        return new ProjectResponse(p.getId(), p.getTitle(), p.getDescription(), p.getLink(), p.getTechStack());
    }

    public static CertificationResponse toCertificationResponse(Certification c) {
        return new CertificationResponse(c.getId(), c.getName(), c.getIssuer(), c.getIssueDate(), c.getLink());
    }

    public static StudentProfileResponse toStudentProfile(Student s) {
        return new StudentProfileResponse(
                s.getId(),
                s.getStudentId(),
                s.getName(),
                s.getDepartment(),
                s.getBatch(),
                s.getCgpa(),
                s.getContactNumber(),
                s.getAddress(),
                s.getProfilePicture(),
                s.getUser() != null ? s.getUser().getEmail() : null,
                s.getSkills().stream().map(ProfileMapper::toSkillResponse).toList(),
                s.getProjects().stream().map(ProfileMapper::toProjectResponse).toList(),
                s.getCertifications().stream().map(ProfileMapper::toCertificationResponse).toList()
        );
    }

    public static PortfolioResponse toPortfolio(Student s) {
        return new PortfolioResponse(
                s.getId(),
                s.getName(),
                s.getDepartment(),
                s.getBatch(),
                s.getCgpa(),
                s.getContactNumber(),
                s.getSkills().stream().map(ProfileMapper::toSkillResponse).toList(),
                s.getProjects().stream().map(ProfileMapper::toProjectResponse).toList(),
                s.getCertifications().stream().map(ProfileMapper::toCertificationResponse).toList()
        );
    }

    public static FacultyProfileResponse toFacultyProfile(Faculty f) {
        return new FacultyProfileResponse(
                f.getId(), f.getName(), f.getDepartment(), f.getDesignation(),
                f.getContactNumber(), f.getUser() != null ? f.getUser().getEmail() : null
        );
    }

    public static CompanyProfileResponse toCompanyProfile(Company c) {
        return new CompanyProfileResponse(
                c.getId(), c.getCompanyName(), c.getDescription(), c.getWebsite(),
                c.getLocation(), c.getContactNumber(), c.getUser() != null ? c.getUser().getEmail() : null
        );
    }

    public static List<SkillResponse> toSkillList(java.util.Collection<Skill> skills) {
        return skills.stream().map(ProfileMapper::toSkillResponse).toList();
    }
}
