package com.ewu.matching.mapper;

import com.ewu.matching.dto.response.*;
import com.ewu.matching.entity.*;

import java.util.List;

public final class ProfileMapper {
    private ProfileMapper() {}

    public static UserResponse toUserResponse(User u) { return toUserResponse(u, null); }

    public static UserResponse toUserResponse(User u, String name) {
        return new UserResponse(u.getId(), u.getEmail(), name,
                u.getRoles().stream().map(Role::getName).collect(java.util.stream.Collectors.toSet()),
                u.isEnabled(), u.isBlocked(), u.getCreatedAt());
    }

    public static SkillResponse toSkillResponse(Skill s) {
        return new SkillResponse(s.getId(), s.getName(), s.getCategory());
    }

    public static ProjectResponse toProjectResponse(Project p) {
        return new ProjectResponse(p.getId(), p.getTitle(), p.getDescription(), p.getLink(),
                p.getRepositoryUrl(), p.getTechStack(), p.getStartDate(), p.getEndDate());
    }

    public static CertificationResponse toCertificationResponse(Certification c) {
        return new CertificationResponse(c.getId(), c.getName(), c.getIssuer(), c.getIssueDate(),
                c.getExpiryDate(), c.getCredentialId(), c.getLink());
    }

    public static StudentProfileResponse toStudentProfile(Student s) {
        return new StudentProfileResponse(
                s.getId(), s.getUser() != null ? s.getUser().getId() : null,
                s.getStudentId(), s.getName(), s.getDepartment(), s.getBatch(), s.getCgpa(),
                s.getHeadline(), s.getBio(), s.getContactNumber(), s.getAddress(),
                s.getProfilePicture(), s.getCoverPicture(), s.getUniversity(),
                s.getUser() != null ? s.getUser().getEmail() : null,
                s.getResumeUrl(),  s.getPortfolioUrl(), s.getGithubUrl(), s.getLinkedinUrl(),
                s.isOpenToWork(),
                s.getSkills().stream().map(ProfileMapper::toSkillResponse).toList(),
                s.getProjects().stream().map(ProfileMapper::toProjectResponse).toList(),
                s.getCertifications().stream().map(ProfileMapper::toCertificationResponse).toList());
    }

    public static PortfolioResponse toPortfolio(Student s) {
        return new PortfolioResponse(
                s.getId(), s.getUser() != null ? s.getUser().getId() : null, s.getStudentId(),
                s.getName(), s.getDepartment(), s.getBatch(), s.getCgpa(), s.getHeadline(), s.getBio(),
                s.getContactNumber(), s.getAddress(), s.getProfilePicture(), s.getResumeUrl(),
                s.getPortfolioUrl(), s.getGithubUrl(), s.getLinkedinUrl(),
                s.getSkills().stream().map(ProfileMapper::toSkillResponse).toList(),
                s.getProjects().stream().map(ProfileMapper::toProjectResponse).toList(),
                s.getCertifications().stream().map(ProfileMapper::toCertificationResponse).toList());
    }

    public static FacultyProfileResponse toFacultyProfileResponse(Faculty f) {
        if (f == null) return null;
        return new FacultyProfileResponse(
                f.getId(), f.getUser() != null ? f.getUser().getId() : null,
                f.getName(), f.getDepartment(), f.getDesignation(), f.getBio(), f.getSpecialization(),
                f.getResearchInterests(), f.getContactNumber(), f.getUniversity(), f.getLocation(),
                f.getUser() != null ? f.getUser().getEmail() : null,
                f.getProfilePicture(), f.getCoverPicture(), f.getGoogleScholarUrl(), f.getOrcidId(),
                f.getResearchgateUrl(), f.getLinkedinUrl(), f.getUniversityProfileUrl(),
                f.isAvailableForSupervision());
    }

    public static CompanyProfileResponse toCompanyProfile(Company c) {
        if (c == null) return null;
        return new CompanyProfileResponse(
                c.getId(), c.getUser() != null ? c.getUser().getId() : null,
                c.getCompanyName(), c.getDescription(), c.getWebsite(), c.getLocation(), c.getIndustry(),
                c.getCompanySize(), c.getFoundedDate(), c.getContactNumber(), c.getCompanyEmail(),
                c.getUser() != null ? c.getUser().getEmail() : null,
                c.getProfilePicture(), c.getCoverPicture(), c.isVerified());
    }

    public static List<SkillResponse> toSkillList(java.util.Collection<Skill> skills) {
        return skills == null ? List.of() : skills.stream().map(ProfileMapper::toSkillResponse).toList();
    }
}
