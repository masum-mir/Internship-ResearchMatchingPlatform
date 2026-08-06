package com.ewu.matching.mapper;

import com.ewu.matching.dto.response.*;
import com.ewu.matching.entity.*;

import java.util.List;

/** Pure entity -> response mapping for users, profiles, skills, projects, certifications. */
public final class ProfileMapper {

    private ProfileMapper() {}

    public static UserResponse toUserResponse(User u) {
        return toUserResponse(u, null);
    }

    public static UserResponse toUserResponse(User u, String name) {
        return new UserResponse(
                u.getId(),
                u.getEmail(),
                name,
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
                s.getCgpa(),
                s.getContactNumber(),
                s.getAddress(),
                s.getProfilePicture(),
                s.getCoverPicture(),
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
                s.getCgpa(),
                s.getContactNumber(),
                s.getSkills().stream().map(ProfileMapper::toSkillResponse).toList(),
                s.getProjects().stream().map(ProfileMapper::toProjectResponse).toList(),
                s.getCertifications().stream().map(ProfileMapper::toCertificationResponse).toList()
        );
    }

    public static FacultyProfileResponse
    toFacultyProfileResponse(Faculty faculty) {

        if (faculty == null) {
            return null;
        }

        return new FacultyProfileResponse(
                faculty.getId(),
                faculty.getName(),
                faculty.getDepartment(),
                faculty.getDesignation(),
                faculty.getBio(),
                faculty.getSpecialization(),
                faculty.getResearchInterests(),
                faculty.getContactNumber(),
                faculty.getUniversity(),
                faculty.getUser() != null
                        ? faculty.getUser().getEmail()
                        : null,
                faculty.getProfilePicture(),
                faculty.getCoverPicture(),
                faculty.getGoogleScholarUrl(),
                faculty.getOrcidId(),
                faculty.getResearchgateUrl(),
                faculty.getLinkedinUrl(),
                faculty.getUniversityProfileUrl()
        );
    }

    public static CompanyProfileResponse toCompanyProfile(Company c) {
        return new CompanyProfileResponse(
                c.getId(), c.getCompanyName(), c.getDescription(), c.getWebsite(),
                c.getLocation(), c.getContactNumber(), c.getUser() != null ? c.getUser().getEmail() : null,
                c.getProfilePicture(), c.getCoverPicture()
        );
    }

    public static List<SkillResponse> toSkillList(java.util.Collection<Skill> skills) {
        return skills.stream().map(ProfileMapper::toSkillResponse).toList();
    }
}
