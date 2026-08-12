package com.ewu.matching.service.impl;

import com.ewu.matching.dto.request.*;
import com.ewu.matching.dto.response.*;
import com.ewu.matching.entity.*;
import com.ewu.matching.enums.*;
import com.ewu.matching.exception.*;
import com.ewu.matching.mapper.ActivityMapper;
import com.ewu.matching.matching.MatchingEngine;
import com.ewu.matching.repository.*;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final InternshipRepository internshipRepository;
    private final ResearchOpportunityRepository researchRepository;
    private final StudentRepository studentRepository;
    private final MatchingEngine matchingEngine;
    private final CurrentUserProvider currentUser;
    private final NotificationService notificationService;
    private final ProfileLookupService profileLookup;

    @Override
    @Transactional
    public ApplicationResponse apply(ApplicationRequest r) {
        if (r.targetType() == null || r.targetId() == null)
            throw new BadRequestException("targetType and targetId are required");
        Student s = studentRepository.findWithDetailsById(currentUser.currentStudent().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        Application a = new Application();
        a.setStudent(s);
        a.setTargetType(r.targetType());
        a.setResumeUrl(clean(r.resumeUrl()) != null ? clean(r.resumeUrl()) : s.getResumeUrl());
        a.setCoverLetter(clean(r.coverLetter()));
        a.setApplicantNote(clean(r.applicantNote()));
        if (r.targetType() == OpportunityType.INTERNSHIP) {
            if (applicationRepository.existsByStudent_IdAndInternship_IdAndStatusNot(s.getId(), r.targetId(),
                    ApplicationStatus.WITHDRAWN))
                throw new DuplicateResourceException("You have already applied to this internship");
            Internship i = internshipRepository.findWithDetailsById(r.targetId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Internship", r.targetId()));
            if (i.getStatus() != PostStatus.ACTIVE
                    || (i.getDeadline() != null && i.getDeadline().isBefore(LocalDate.now())))
                throw new BadRequestException("This internship is not accepting applications");
            a.setInternship(i);
            a.setMatchScore(matchingEngine
                    .score(s, i.getRequiredSkills(), i.getRequiredCgpa(), i.getTargetDepartments()).finalScore());
            a = applicationRepository.save(a);
            notificationService.create(i.getCompany().getUser(), s.getUser(), NotificationType.APPLICATION_SUBMITTED,
                    profileLookup.displayName(s.getUser()) + " applied to " + i.getTitle(), "APPLICATION", a.getId());
        } else {
            if (applicationRepository.existsByStudent_IdAndResearch_IdAndStatusNot(s.getId(), r.targetId(),
                    ApplicationStatus.WITHDRAWN))
                throw new DuplicateResourceException("You have already applied to this research post");
            ResearchOpportunity x = researchRepository.findWithDetailsById(r.targetId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Research opportunity", r.targetId()));
            if (x.getStatus() != PostStatus.ACTIVE
                    || (x.getApplicationDeadline() != null && x.getApplicationDeadline().isBefore(LocalDateTime.now())))
                throw new BadRequestException("This research post is not accepting applications");
            a.setResearch(x);
            a.setMatchScore(matchingEngine.score(s, x.getRequiredSkills(), x.getMinCgpa(), x.getTargetDepartments())
                    .finalScore());
            a = applicationRepository.save(a);
            notificationService.create(x.getFaculty().getUser(), s.getUser(), NotificationType.APPLICATION_SUBMITTED,
                    profileLookup.displayName(s.getUser()) + " applied to " + x.getTopic(), "APPLICATION", a.getId());
        }
        return ActivityMapper.toApplicationResponse(a);
    }

    @Override
    @Transactional
    public void withdraw(Long id, String reason) {
        Application a = applicationRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Application", id));
        if (!a.getStudent().getId().equals(currentUser.currentStudent().getId()))
            throw new ForbiddenOperationException("You can only withdraw your own application");
        boolean wasAccepted = a.getStatus() == ApplicationStatus.ACCEPTED;
        String cleanReason = clean(reason);
        if (wasAccepted && cleanReason == null)
            throw new BadRequestException("Please explain why you're withdrawing after accepting this offer");
        a.setStatus(ApplicationStatus.WITHDRAWN);
        a.setWithdrawnAt(LocalDateTime.now());
        if (cleanReason != null)
            a.setWithdrawalReason(cleanReason);
        applicationRepository.save(a);

        if (wasAccepted) {
            User actor;
            String title;
            if (a.getTargetType() == OpportunityType.INTERNSHIP) {
                actor = a.getInternship().getCompany().getUser();
                title = a.getInternship().getTitle();
            } else {
                actor = a.getResearch().getFaculty().getUser();
                title = a.getResearch().getTopic();
            }
            notificationService.create(actor, a.getStudent().getUser(), NotificationType.APPLICATION_STATUS_CHANGED,
                    profileLookup.displayName(a.getStudent().getUser()) + " withdrew from \"" + title
                            + "\" after accepting. Reason: " + cleanReason,
                    "APPLICATION", a.getId());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> myApplications() {
        return applicationRepository.findByStudent_Id(currentUser.currentStudent().getId()).stream()
                .map(ActivityMapper::toApplicationResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicantResponse> getApplicantsForInternship(Long id) {
        Internship i = internshipRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Internship", id));
        if (!i.getCompany().getId().equals(currentUser.currentCompany().getId()))
            throw new ForbiddenOperationException("You can only view applicants for your own internships");
        return applicationRepository.findByInternship_Id(id).stream()
                .filter(a -> a.getStatus() != ApplicationStatus.WITHDRAWN).map(ActivityMapper::toApplicantResponse)
                .sorted(Comparator.comparing(ApplicantResponse::matchScore,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicantResponse> getApplicantsForResearch(Long id) {
        ResearchOpportunity x = researchRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Research opportunity", id));
        if (!x.getFaculty().getId().equals(currentUser.currentFaculty().getId()))
            throw new ForbiddenOperationException("You can only view applicants for your own research posts");
        return applicationRepository.findByResearch_Id(id).stream()
                .filter(a -> a.getStatus() != ApplicationStatus.WITHDRAWN).map(ActivityMapper::toApplicantResponse)
                .sorted(Comparator.comparing(ApplicantResponse::matchScore,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    @Override
    @Transactional
    public ApplicationResponse updateStatus(Long id, ApplicationStatusRequest r) {
        if (r.status() == null)
            throw new BadRequestException("status is required");
        if (r.status() == ApplicationStatus.WITHDRAWN)
            throw new BadRequestException("Only the student can withdraw an application");
        Application a = applicationRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Application", id));
        User actor;
        String title;
        if (a.getTargetType() == OpportunityType.INTERNSHIP) {
            Long owner = a.getInternship().getCompany().getId();
            Company c = currentUser.currentCompany();
            if (!owner.equals(c.getId()))
                throw new ForbiddenOperationException("You can only manage applicants for your own internships");
            actor = c.getUser();
            title = a.getInternship().getTitle();
        } else {
            Long owner = a.getResearch().getFaculty().getId();
            Faculty f = currentUser.currentFaculty();
            if (!owner.equals(f.getId()))
                throw new ForbiddenOperationException("You can only manage applicants for your own research posts");
            actor = f.getUser();
            title = a.getResearch().getTopic();
        }
        a.setStatus(r.status());
        a.setReviewerNote(clean(r.reviewerNote()));
        a.setReviewedAt(LocalDateTime.now());
        a = applicationRepository.save(a);
        notificationService.create(a.getStudent().getUser(), actor, NotificationType.APPLICATION_STATUS_CHANGED,
                "Your application for " + title + " is now " + r.status(), "APPLICATION", a.getId());
        return ActivityMapper.toApplicationResponse(a);
    }

    private String clean(String s) {
        if (s == null)
            return null;
        String v = s.trim();
        return v.isEmpty() ? null : v;
    }
}
