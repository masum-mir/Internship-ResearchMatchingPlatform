package com.ewu.matching.service.impl;

import com.ewu.matching.dto.request.ApplicationRequest;
import com.ewu.matching.dto.request.ApplicationStatusRequest;
import com.ewu.matching.dto.response.ApplicantResponse;
import com.ewu.matching.dto.response.ApplicationResponse;
import com.ewu.matching.entity.*;
import com.ewu.matching.enums.OpportunityType;
import com.ewu.matching.exception.BadRequestException;
import com.ewu.matching.exception.DuplicateResourceException;
import com.ewu.matching.exception.ForbiddenOperationException;
import com.ewu.matching.exception.ResourceNotFoundException;
import com.ewu.matching.mapper.ActivityMapper;
import com.ewu.matching.matching.MatchingEngine;
import com.ewu.matching.repository.*;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final InternshipRepository internshipRepository;
    private final ResearchOpportunityRepository researchRepository;
    private final StudentRepository studentRepository;
    private final MatchingEngine matchingEngine;
    private final CurrentUserProvider currentUser;

    @Override
    @Transactional
    public ApplicationResponse apply(ApplicationRequest req) {
        if (req.targetType() == null || req.targetId() == null) {
            throw new BadRequestException("targetType and targetId are required");
        }
        Student student = studentRepository.findWithDetailsById(currentUser.currentStudent().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Application application = Application.builder()
                .student(student)
                .targetType(req.targetType())
                .build();

        if (req.targetType() == OpportunityType.INTERNSHIP) {
            if (applicationRepository.existsByStudent_IdAndInternship_Id(student.getId(), req.targetId())) {
                throw new DuplicateResourceException("You have already applied to this internship");
            }
            Internship internship = internshipRepository.findWithDetailsById(req.targetId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Internship", req.targetId()));
            double score = matchingEngine.score(student, internship.getRequiredSkills(),
                    internship.getRequiredCgpa(), internship.getTargetDepartments()).finalScore();
            application.setInternship(internship);
            application.setMatchScore(score);
        } else {
            if (applicationRepository.existsByStudent_IdAndResearch_Id(student.getId(), req.targetId())) {
                throw new DuplicateResourceException("You have already applied to this research post");
            }
            ResearchOpportunity research = researchRepository.findWithDetailsById(req.targetId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Research opportunity", req.targetId()));
            double score = matchingEngine.score(student, research.getRequiredSkills(),
                    research.getMinCgpa(), research.getTargetDepartments()).finalScore();
            application.setResearch(research);
            application.setMatchScore(score);
        }
        return ActivityMapper.toApplicationResponse(applicationRepository.save(application));
    }

    @Override
    @Transactional
    public void withdraw(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> ResourceNotFoundException.of("Application", applicationId));
        if (!application.getStudent().getId().equals(currentUser.currentStudent().getId())) {
            throw new ForbiddenOperationException("You can only withdraw your own application");
        }
        applicationRepository.delete(application);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> myApplications() {
        return applicationRepository.findByStudent_Id(currentUser.currentStudent().getId())
                .stream().map(ActivityMapper::toApplicationResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicantResponse> getApplicantsForInternship(Long internshipId) {
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> ResourceNotFoundException.of("Internship", internshipId));
        if (!internship.getCompany().getId().equals(currentUser.currentCompany().getId())) {
            throw new ForbiddenOperationException("You can only view applicants for your own internships");
        }
        return applicationRepository.findByInternship_Id(internshipId).stream()
                .map(ActivityMapper::toApplicantResponse)
                .sorted(Comparator.comparing(ApplicantResponse::matchScore,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicantResponse> getApplicantsForResearch(Long researchId) {
        ResearchOpportunity research = researchRepository.findById(researchId)
                .orElseThrow(() -> ResourceNotFoundException.of("Research opportunity", researchId));
        if (!research.getFaculty().getId().equals(currentUser.currentFaculty().getId())) {
            throw new ForbiddenOperationException("You can only view applicants for your own research posts");
        }
        return applicationRepository.findByResearch_Id(researchId).stream()
                .map(ActivityMapper::toApplicantResponse)
                .sorted(Comparator.comparing(ApplicantResponse::matchScore,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    @Override
    @Transactional
    public ApplicationResponse updateStatus(Long applicationId, ApplicationStatusRequest req) {
        if (req.status() == null) {
            throw new BadRequestException("status is required");
        }
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> ResourceNotFoundException.of("Application", applicationId));

        if (application.getTargetType() == OpportunityType.INTERNSHIP) {
            Long ownerCompanyId = application.getInternship().getCompany().getId();
            if (!ownerCompanyId.equals(currentUser.currentCompany().getId())) {
                throw new ForbiddenOperationException("You can only manage applicants for your own internships");
            }
        } else {
            Long ownerFacultyId = application.getResearch().getFaculty().getId();
            if (!ownerFacultyId.equals(currentUser.currentFaculty().getId())) {
                throw new ForbiddenOperationException("You can only manage applicants for your own research posts");
            }
        }
        application.setStatus(req.status());
        return ActivityMapper.toApplicationResponse(applicationRepository.save(application));
    }
}
