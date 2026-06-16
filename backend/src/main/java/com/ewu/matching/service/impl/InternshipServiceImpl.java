package com.ewu.matching.service.impl;

import com.ewu.matching.dto.request.InternshipRequest;
import com.ewu.matching.dto.request.SkillRequest;
import com.ewu.matching.dto.response.InternshipResponse;
import com.ewu.matching.dto.response.MatchBreakdownResponse;
import com.ewu.matching.dto.response.MatchedInternshipResponse;
import com.ewu.matching.entity.Company;
import com.ewu.matching.entity.Internship;
import com.ewu.matching.entity.Skill;
import com.ewu.matching.entity.Student;
import com.ewu.matching.enums.PostStatus;
import com.ewu.matching.exception.ForbiddenOperationException;
import com.ewu.matching.exception.ResourceNotFoundException;
import com.ewu.matching.mapper.OpportunityMapper;
import com.ewu.matching.matching.MatchingEngine;
import com.ewu.matching.repository.InternshipRepository;
import com.ewu.matching.repository.InternshipSpecifications;
import com.ewu.matching.repository.StudentRepository;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.InternshipService;
import com.ewu.matching.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InternshipServiceImpl implements InternshipService {

    private final InternshipRepository internshipRepository;
    private final StudentRepository studentRepository;
    private final SkillService skillService;
    private final MatchingEngine matchingEngine;
    private final CurrentUserProvider currentUser;

    @Override
    @Transactional
    public InternshipResponse create(InternshipRequest req) {
        Company company = currentUser.currentCompany();
        Internship internship = Internship.builder()
                .company(company)
                .title(req.title())
                .description(req.description())
                .requiredCgpa(req.requiredCgpa())
                .location(req.location())
                .deadline(req.deadline())
                .vacancies(req.vacancies())
                .status(PostStatus.ACTIVE)
                .requiredSkills(resolveSkills(req.requiredSkills()))
                .targetDepartments(req.targetDepartments() != null ? new HashSet<>(req.targetDepartments()) : new HashSet<>())
                .build();
        return OpportunityMapper.toInternshipResponse(internshipRepository.save(internship));
    }

    @Override
    @Transactional
    public InternshipResponse update(Long id, InternshipRequest req) {
        Internship internship = internshipRepository.findWithDetailsById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Internship", id));
        assertOwnership(internship.getCompany());
        if (req.title() != null) internship.setTitle(req.title());
        if (req.description() != null) internship.setDescription(req.description());
        if (req.requiredCgpa() != null) internship.setRequiredCgpa(req.requiredCgpa());
        if (req.location() != null) internship.setLocation(req.location());
        if (req.deadline() != null) internship.setDeadline(req.deadline());
        if (req.vacancies() != null) internship.setVacancies(req.vacancies());
        if (req.requiredSkills() != null) internship.setRequiredSkills(resolveSkills(req.requiredSkills()));
        if (req.targetDepartments() != null) internship.setTargetDepartments(new HashSet<>(req.targetDepartments()));
        return OpportunityMapper.toInternshipResponse(internshipRepository.save(internship));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Internship", id));
        assertOwnership(internship.getCompany());
        internshipRepository.delete(internship);
    }

    @Override
    @Transactional(readOnly = true)
    public InternshipResponse getById(Long id) {
        return OpportunityMapper.toInternshipResponse(
                internshipRepository.findWithDetailsById(id)
                        .orElseThrow(() -> ResourceNotFoundException.of("Internship", id)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InternshipResponse> search(String title, String company, String skill, String location) {
        Specification<Internship> spec = Specification.where(InternshipSpecifications.isActive())
                .and(InternshipSpecifications.titleContains(title))
                .and(InternshipSpecifications.companyNameContains(company))
                .and(InternshipSpecifications.hasSkill(skill))
                .and(InternshipSpecifications.locationContains(location));
        return internshipRepository.findAll(spec).stream()
                .map(OpportunityMapper::toInternshipResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<InternshipResponse> listMine() {
        return internshipRepository.findByCompany_Id(currentUser.currentCompany().getId())
                .stream().map(OpportunityMapper::toInternshipResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchedInternshipResponse> getMatchedForCurrentStudent() {
        Student student = studentRepository.findWithDetailsById(currentUser.currentStudent().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return internshipRepository.findAllByStatus(PostStatus.ACTIVE).stream()
                .map(i -> {
                    MatchBreakdownResponse m = matchingEngine.score(
                            student, i.getRequiredSkills(), i.getRequiredCgpa(), i.getTargetDepartments());
                    return new MatchedInternshipResponse(OpportunityMapper.toInternshipResponse(i), m);
                })
                .sorted(Comparator.comparingDouble((MatchedInternshipResponse r) -> r.match().finalScore()).reversed())
                .toList();
    }

    private Set<Skill> resolveSkills(List<SkillRequest> requested) {
        if (requested == null) return new HashSet<>();
        return requested.stream()
                .map(skillService::resolveOrCreate)
                .collect(Collectors.toCollection(HashSet::new));
    }

    private void assertOwnership(Company owner) {
        if (owner == null || !owner.getId().equals(currentUser.currentCompany().getId())) {
            throw new ForbiddenOperationException("You do not own this internship");
        }
    }
}
