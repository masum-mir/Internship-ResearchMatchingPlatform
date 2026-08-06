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
        Student student = studentRepository.findWithDetailsById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Student", id));
        return student;
    }

    @Override
    @Transactional(readOnly = true)
    public StudentProfileResponse getMyProfile() {
        return ProfileMapper.toStudentProfile(loadCurrentDetailed());
    }

    @Override
    @Transactional
    public StudentProfileResponse updateMyProfile(StudentProfileRequest req) {
        Student s = currentUser.currentStudent();
        if (StringUtils.hasText(req.studentId()) && !req.studentId().equals(s.getStudentId())
                && studentRepository.existsByStudentId(req.studentId())) {
            throw new DuplicateResourceException("Student ID already in use: " + req.studentId());
        }
        if (req.name() != null) s.setName(req.name());
        if (req.studentId() != null) s.setStudentId(req.studentId());
        if (req.department() != null) s.setDepartment(req.department());
        if (req.cgpa() != null) s.setCgpa(req.cgpa());
        if (req.contactNumber() != null) s.setContactNumber(req.contactNumber());
        if (req.address() != null) s.setAddress(req.address());
        if (req.profilePicture() != null) s.setProfilePicture(req.profilePicture());
        if (req.coverPicture() != null) s.setCoverPicture(req.coverPicture());
        studentRepository.save(s);
        return ProfileMapper.toStudentProfile(loadCurrentDetailed());
    }

    // ---- Skills ----
    @Override
    @Transactional
    public List<SkillResponse> addSkill(SkillRequest req) {
        Student s = currentUser.currentStudent();
        Skill skill = skillService.resolveOrCreate(req);
        s.getSkills().add(skill);
        studentRepository.save(s);
        return ProfileMapper.toSkillList(s.getSkills());
    }

    @Override
    @Transactional
    public List<SkillResponse> removeSkill(Long skillId) {
        Student s = currentUser.currentStudent();
        s.getSkills().removeIf(sk -> sk.getId().equals(skillId));
        studentRepository.save(s);
        return ProfileMapper.toSkillList(s.getSkills());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillResponse> listMySkills() {
        return ProfileMapper.toSkillList(loadCurrentDetailed().getSkills());
    }

    // ---- Projects ----
    @Override
    @Transactional
    public ProjectResponse addProject(ProjectRequest req) {
        Student s = currentUser.currentStudent();
        Project p = Project.builder()
                .student(s).title(req.title()).description(req.description())
                .link(req.link()).techStack(req.techStack()).build();
        return ProfileMapper.toProjectResponse(projectRepository.save(p));
    }

    @Override
    @Transactional
    public ProjectResponse updateProject(Long projectId, ProjectRequest req) {
        Project p = projectRepository.findById(projectId)
                .orElseThrow(() -> ResourceNotFoundException.of("Project", projectId));
        assertOwnership(p.getStudent());
        if (req.title() != null) p.setTitle(req.title());
        if (req.description() != null) p.setDescription(req.description());
        if (req.link() != null) p.setLink(req.link());
        if (req.techStack() != null) p.setTechStack(req.techStack());
        return ProfileMapper.toProjectResponse(projectRepository.save(p));
    }

    @Override
    @Transactional
    public void deleteProject(Long projectId) {
        Project p = projectRepository.findById(projectId)
                .orElseThrow(() -> ResourceNotFoundException.of("Project", projectId));
        assertOwnership(p.getStudent());
        projectRepository.delete(p);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> listMyProjects() {
        return projectRepository.findByStudent_Id(currentUser.currentStudent().getId())
                .stream().map(ProfileMapper::toProjectResponse).toList();
    }

    // ---- Certifications ----
    @Override
    @Transactional
    public CertificationResponse addCertification(CertificationRequest req) {
        Student s = currentUser.currentStudent();
        Certification c = Certification.builder()
                .student(s).name(req.name()).issuer(req.issuer())
                .issueDate(req.issueDate()).link(req.link()).build();
        return ProfileMapper.toCertificationResponse(certificationRepository.save(c));
    }

    @Override
    @Transactional
    public CertificationResponse updateCertification(Long certificationId, CertificationRequest req) {
        Certification c = certificationRepository.findById(certificationId)
                .orElseThrow(() -> ResourceNotFoundException.of("Certification", certificationId));
        assertOwnership(c.getStudent());
        if (req.name() != null) c.setName(req.name());
        if (req.issuer() != null) c.setIssuer(req.issuer());
        if (req.issueDate() != null) c.setIssueDate(req.issueDate());
        if (req.link() != null) c.setLink(req.link());
        return ProfileMapper.toCertificationResponse(certificationRepository.save(c));
    }

    @Override
    @Transactional
    public void deleteCertification(Long certificationId) {
        Certification c = certificationRepository.findById(certificationId)
                .orElseThrow(() -> ResourceNotFoundException.of("Certification", certificationId));
        assertOwnership(c.getStudent());
        certificationRepository.delete(c);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CertificationResponse> listMyCertifications() {
        return certificationRepository.findByStudent_Id(currentUser.currentStudent().getId())
                .stream().map(ProfileMapper::toCertificationResponse).toList();
    }

    // ---- Portfolio (company/faculty/admin view) ----
    @Override
    @Transactional(readOnly = true)
    public PortfolioResponse getPortfolio(Long studentId) {
        Student s = studentRepository.findWithDetailsById(studentId)
                .orElseThrow(() -> ResourceNotFoundException.of("Student", studentId));
        return ProfileMapper.toPortfolio(s);
    }

    private void assertOwnership(Student owner) {
        if (owner == null || !owner.getId().equals(currentUser.currentStudent().getId())) {
            throw new ForbiddenOperationException("You do not own this resource");
        }
    }
}
