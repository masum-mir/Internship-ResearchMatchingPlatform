package com.ewu.matching.service;

import com.ewu.matching.dto.request.*;
import com.ewu.matching.dto.response.*;

import java.util.List;

public interface StudentService {
    StudentProfileResponse getMyProfile();
    StudentProfileResponse updateMyProfile(StudentProfileRequest request);

    List<SkillResponse> addSkill(SkillRequest request);
    List<SkillResponse> removeSkill(Long skillId);
    List<SkillResponse> listMySkills();

    ProjectResponse addProject(ProjectRequest request);
    ProjectResponse updateProject(Long projectId, ProjectRequest request);
    void deleteProject(Long projectId);
    List<ProjectResponse> listMyProjects();

    CertificationResponse addCertification(CertificationRequest request);
    CertificationResponse updateCertification(Long certificationId, CertificationRequest request);
    void deleteCertification(Long certificationId);
    List<CertificationResponse> listMyCertifications();

    /** Full applicant portfolio, viewed by company/faculty/admin. */
    PortfolioResponse getPortfolio(Long studentId);
}
