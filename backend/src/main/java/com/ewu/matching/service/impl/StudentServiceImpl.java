package com.ewu.matching.service.impl;

import com.ewu.matching.dto.request.*;
import com.ewu.matching.dto.response.*;
import com.ewu.matching.entity.*;
import com.ewu.matching.exception.DuplicateResourceException;
import com.ewu.matching.exception.ForbiddenOperationException;
import com.ewu.matching.exception.ResourceNotFoundException;
import com.ewu.matching.mapper.ProfileMapper;
import com.ewu.matching.repository.*;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.SkillService;
import com.ewu.matching.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;
    private final ProjectRepository projectRepository;
    private final CertificationRepository certificationRepository;
    private final SkillService skillService;
    private final CurrentUserProvider currentUser;

    private Student loadCurrentDetailed() {
        Long id = currentUser.currentStudent().getId();
        return studentRepository.findWithDetailsById(id).orElseThrow(() -> ResourceNotFoundException.of("Student", id));
    }

    @Override
    @Transactional(readOnly = true)
    public StudentProfileResponse getMyProfile() {
        return ProfileMapper.toStudentProfile(loadCurrentDetailed());
    }

    @Override
    @Transactional
    public StudentProfileResponse updateMyProfile(StudentProfileRequest r) {
        Student s = currentUser.currentStudent();
        if (StringUtils.hasText(r.studentId()) && !r.studentId().equals(s.getStudentId())
                && studentRepository.existsByStudentId(r.studentId()))
            throw new DuplicateResourceException("Student ID already in use: " + r.studentId());
        if (r.name() != null)
            s.setName(clean(r.name()));
        if (r.studentId() != null)
            s.setStudentId(clean(r.studentId()));
        if (r.department() != null)
            s.setDepartment(clean(r.department()));
        if (r.university() != null)
            s.setUniversity(clean(r.university()));
        if (r.batch() != null)
            s.setBatch(clean(r.batch()));
        if (r.cgpa() != null)
            s.setCgpa(r.cgpa());
        if (r.headline() != null)
            s.setHeadline(clean(r.headline()));
        if (r.bio() != null)
            s.setBio(clean(r.bio()));
        if (r.contactNumber() != null)
            s.setContactNumber(clean(r.contactNumber()));
        if (r.address() != null)
            s.setAddress(clean(r.address()));
        if (r.profilePicture() != null)
            s.setProfilePicture(clean(r.profilePicture()));
        if (r.coverPicture() != null)
            s.setCoverPicture(clean(r.coverPicture()));
        if (r.resumeUrl() != null)
            s.setResumeUrl(clean(r.resumeUrl()));
        if (r.portfolioUrl() != null)
            s.setPortfolioUrl(clean(r.portfolioUrl()));
        if (r.githubUrl() != null)
            s.setGithubUrl(clean(r.githubUrl()));
        if (r.linkedinUrl() != null)
            s.setLinkedinUrl(clean(r.linkedinUrl()));
        if (r.openToWork() != null)
            s.setOpenToWork(r.openToWork());
        studentRepository.save(s);
        return ProfileMapper.toStudentProfile(loadCurrentDetailed());
    }

    @Override
    @Transactional
    public List<SkillResponse> addSkill(SkillRequest r) {
        Student s = currentUser.currentStudent();
        Skill skill = skillService.resolveOrCreate(r);
        s.getSkills().add(skill);
        studentRepository.save(s);
        return ProfileMapper.toSkillList(s.getSkills());
    }

    @Override
    @Transactional
    public List<SkillResponse> removeSkill(Long skillId) {
        Student s = currentUser.currentStudent();
        s.getSkills().removeIf(x -> x.getId().equals(skillId));
        studentRepository.save(s);
        return ProfileMapper.toSkillList(s.getSkills());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillResponse> listMySkills() {
        return ProfileMapper.toSkillList(loadCurrentDetailed().getSkills());
    }

    @Override
    @Transactional
    public ProjectResponse addProject(ProjectRequest r) {
        Student s = currentUser.currentStudent();
        Project p = Project.builder().student(s).title(r.title()).description(r.description()).link(r.link())
                .repositoryUrl(r.repositoryUrl()).techStack(r.techStack()).startDate(r.startDate()).endDate(r.endDate())
                .build();
        return ProfileMapper.toProjectResponse(projectRepository.save(p));
    }

    @Override
    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest r) {
        Project p = projectRepository.findById(id).orElseThrow(() -> ResourceNotFoundException.of("Project", id));
        assertOwnership(p.getStudent());
        if (r.title() != null)
            p.setTitle(r.title());
        if (r.description() != null)
            p.setDescription(r.description());
        if (r.link() != null)
            p.setLink(r.link());
        if (r.repositoryUrl() != null)
            p.setRepositoryUrl(r.repositoryUrl());
        if (r.techStack() != null)
            p.setTechStack(r.techStack());
        if (r.startDate() != null)
            p.setStartDate(r.startDate());
        if (r.endDate() != null)
            p.setEndDate(r.endDate());
        return ProfileMapper.toProjectResponse(projectRepository.save(p));
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        Project p = projectRepository.findById(id).orElseThrow(() -> ResourceNotFoundException.of("Project", id));
        assertOwnership(p.getStudent());
        projectRepository.delete(p);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> listMyProjects() {
        return projectRepository.findByStudent_Id(currentUser.currentStudent().getId()).stream()
                .map(ProfileMapper::toProjectResponse).toList();
    }

    @Override
    @Transactional
    public CertificationResponse addCertification(CertificationRequest r) {
        Student s = currentUser.currentStudent();
        Certification c = Certification.builder().student(s).name(r.name()).issuer(r.issuer()).issueDate(r.issueDate())
                .expiryDate(r.expiryDate()).credentialId(r.credentialId()).link(r.link()).build();
        return ProfileMapper.toCertificationResponse(certificationRepository.save(c));
    }

    @Override
    @Transactional
    public CertificationResponse updateCertification(Long id, CertificationRequest r) {
        Certification c = certificationRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Certification", id));
        assertOwnership(c.getStudent());
        if (r.name() != null)
            c.setName(r.name());
        if (r.issuer() != null)
            c.setIssuer(r.issuer());
        if (r.issueDate() != null)
            c.setIssueDate(r.issueDate());
        if (r.expiryDate() != null)
            c.setExpiryDate(r.expiryDate());
        if (r.credentialId() != null)
            c.setCredentialId(r.credentialId());
        if (r.link() != null)
            c.setLink(r.link());
        return ProfileMapper.toCertificationResponse(certificationRepository.save(c));
    }

    @Override
    @Transactional
    public void deleteCertification(Long id) {
        Certification c = certificationRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Certification", id));
        assertOwnership(c.getStudent());
        certificationRepository.delete(c);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CertificationResponse> listMyCertifications() {
        return certificationRepository.findByStudent_Id(currentUser.currentStudent().getId()).stream()
                .map(ProfileMapper::toCertificationResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PortfolioResponse getPortfolio(Long studentId) {
        Student s = studentRepository.findWithDetailsById(studentId)
                .orElseThrow(() -> ResourceNotFoundException.of("Student", studentId));
        return ProfileMapper.toPortfolio(s);
    }

    private void assertOwnership(Student owner) {
        if (owner == null || !owner.getId().equals(currentUser.currentStudent().getId()))
            throw new ForbiddenOperationException("You do not own this resource");
    }

    private String clean(String s) {
        if (s == null)
            return null;
        String v = s.trim();
        return v.isEmpty() ? null : v;
    }
}
