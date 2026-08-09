package com.ewu.matching.service.impl;

import com.ewu.matching.dto.request.*;
import com.ewu.matching.dto.response.*;
import com.ewu.matching.entity.*;
import com.ewu.matching.enums.*;
import com.ewu.matching.exception.*;
import com.ewu.matching.mapper.OpportunityMapper;
import com.ewu.matching.matching.MatchingEngine;
import com.ewu.matching.repository.*;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InternshipServiceImpl implements InternshipService {
    private final InternshipRepository internshipRepository;
    private final StudentRepository studentRepository;
    private final SkillService skillService;
    private final MatchingEngine matchingEngine;
    private final CurrentUserProvider currentUser;
    private final UserFollowRepository followRepository;
    private final NotificationService notificationService;
    private final ProfileLookupService profileLookup;

    @Override
    @Transactional
    public InternshipResponse create(InternshipRequest r) {
        Company c = currentUser.currentCompany();
        validateSalary(r.salaryMin(), r.salaryMax());
        Internship i = Internship.builder().company(c).title(r.title()).description(r.description())
                .responsibilities(r.responsibilities()).requirements(r.requirements()).benefits(r.benefits())
                .requiredCgpa(r.requiredCgpa()).location(r.location()).workMode(r.workMode())
                .employmentType(r.employmentType() == null ? EmploymentType.INTERNSHIP : r.employmentType())
                .salaryMin(r.salaryMin()).salaryMax(r.salaryMax()).salaryCurrency(r.salaryCurrency())
                .experienceLevel(r.experienceLevel()).deadline(r.deadline()).vacancies(r.vacancies())
                .status(PostStatus.ACTIVE).requiredSkills(resolveSkills(r.requiredSkills())).targetDepartments(
                        r.targetDepartments() != null ? new HashSet<>(r.targetDepartments()) : new HashSet<>())
                .build();
        i = internshipRepository.save(i);
        for (UserFollow f : followRepository.findByFollowing_IdOrderByCreatedAtDesc(c.getUser().getId()))
            notificationService.create(f.getFollower(), c.getUser(), NotificationType.NEW_OPPORTUNITY,
                    c.getCompanyName() + " posted " + i.getTitle(), "INTERNSHIP", i.getId());
        return OpportunityMapper.toInternshipResponse(i);
    }

    @Override
    @Transactional
    public InternshipResponse update(Long id, InternshipRequest r) {
        Internship i = internshipRepository.findWithDetailsById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Internship", id));
        assertOwnership(i.getCompany());
        if (r.title() != null)
            i.setTitle(r.title());
        if (r.description() != null)
            i.setDescription(r.description());
        if (r.responsibilities() != null)
            i.setResponsibilities(r.responsibilities());
        if (r.requirements() != null)
            i.setRequirements(r.requirements());
        if (r.benefits() != null)
            i.setBenefits(r.benefits());
        if (r.requiredCgpa() != null)
            i.setRequiredCgpa(r.requiredCgpa());
        if (r.location() != null)
            i.setLocation(r.location());
        if (r.workMode() != null)
            i.setWorkMode(r.workMode());
        if (r.employmentType() != null)
            i.setEmploymentType(r.employmentType());
        if (r.salaryMin() != null)
            i.setSalaryMin(r.salaryMin());
        if (r.salaryMax() != null)
            i.setSalaryMax(r.salaryMax());
        if (r.salaryCurrency() != null)
            i.setSalaryCurrency(r.salaryCurrency());
        if (r.experienceLevel() != null)
            i.setExperienceLevel(r.experienceLevel());
        if (r.deadline() != null)
            i.setDeadline(r.deadline());
        if (r.vacancies() != null)
            i.setVacancies(r.vacancies());
        if (r.requiredSkills() != null)
            i.setRequiredSkills(resolveSkills(r.requiredSkills()));
        if (r.targetDepartments() != null)
            i.setTargetDepartments(new HashSet<>(r.targetDepartments()));
        validateSalary(i.getSalaryMin(), i.getSalaryMax());
        return OpportunityMapper.toInternshipResponse(internshipRepository.save(i));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Internship i = internshipRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Internship", id));
        assertOwnership(i.getCompany());
        internshipRepository.delete(i);
    }

    @Override
    @Transactional(readOnly = true)
    public InternshipResponse getById(Long id) {
        return OpportunityMapper.toInternshipResponse(internshipRepository.findWithDetailsById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Internship", id)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InternshipResponse> search(String title, String company, String skill, String location) {
        Specification<Internship> spec = Specification.where(InternshipSpecifications.isActive())
                .and(InternshipSpecifications.titleContains(title))
                .and(InternshipSpecifications.companyNameContains(company))
                .and(InternshipSpecifications.hasSkill(skill)).and(InternshipSpecifications.locationContains(location));
        return internshipRepository.findAll(spec).stream().map(OpportunityMapper::toInternshipResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<InternshipResponse> listMine() {
        return internshipRepository.findByCompany_Id(currentUser.currentCompany().getId()).stream()
                .map(OpportunityMapper::toInternshipResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchedInternshipResponse> getMatchedForCurrentStudent() {
        Student s = studentRepository.findWithDetailsById(currentUser.currentStudent().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return internshipRepository.findAllByStatus(PostStatus.ACTIVE).stream()
                .filter(i -> i.getDeadline() == null || !i.getDeadline().isBefore(java.time.LocalDate.now())).map(i -> {
                    MatchBreakdownResponse m = matchingEngine.score(s, i.getRequiredSkills(), i.getRequiredCgpa(),
                            i.getTargetDepartments());
                    return new MatchedInternshipResponse(OpportunityMapper.toInternshipResponse(i), m);
                })
                .sorted(Comparator.comparingDouble((MatchedInternshipResponse x) -> x.match().finalScore()).reversed())
                .toList();
    }

    private Set<Skill> resolveSkills(List<SkillRequest> requested) {
        if (requested == null)
            return new HashSet<>();
        return requested.stream().map(skillService::resolveOrCreate).collect(Collectors.toCollection(HashSet::new));
    }

    private void assertOwnership(Company c) {
        if (c == null || !c.getId().equals(currentUser.currentCompany().getId()))
            throw new ForbiddenOperationException("You do not own this internship");
    }

    private void validateSalary(BigDecimal a, BigDecimal b) {
        if (a != null && b != null && b.compareTo(a) < 0)
            throw new BadRequestException("salaryMax cannot be less than salaryMin");
    }
}
