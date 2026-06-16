package com.ewu.matching.service.impl;

import com.ewu.matching.dto.request.ResearchRequest;
import com.ewu.matching.dto.request.SkillRequest;
import com.ewu.matching.dto.response.MatchBreakdownResponse;
import com.ewu.matching.dto.response.MatchedResearchResponse;
import com.ewu.matching.dto.response.ResearchResponse;
import com.ewu.matching.entity.Faculty;
import com.ewu.matching.entity.ResearchOpportunity;
import com.ewu.matching.entity.Skill;
import com.ewu.matching.entity.Student;
import com.ewu.matching.enums.PostStatus;
import com.ewu.matching.exception.ForbiddenOperationException;
import com.ewu.matching.exception.ResourceNotFoundException;
import com.ewu.matching.mapper.OpportunityMapper;
import com.ewu.matching.matching.MatchingEngine;
import com.ewu.matching.repository.ResearchOpportunityRepository;
import com.ewu.matching.repository.ResearchSpecifications;
import com.ewu.matching.repository.StudentRepository;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.ResearchService;
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
public class ResearchServiceImpl implements ResearchService {

    private final ResearchOpportunityRepository researchRepository;
    private final StudentRepository studentRepository;
    private final SkillService skillService;
    private final MatchingEngine matchingEngine;
    private final CurrentUserProvider currentUser;

    @Override
    @Transactional
    public ResearchResponse create(ResearchRequest req) {
        Faculty faculty = currentUser.currentFaculty();
        ResearchOpportunity research = ResearchOpportunity.builder()
                .faculty(faculty)
                .topic(req.topic())
                .researchArea(req.researchArea())
                .minCgpa(req.minCgpa())
                .duration(req.duration())
                .supervisor(req.supervisor() != null ? req.supervisor() : faculty.getName())
                .status(PostStatus.ACTIVE)
                .requiredSkills(resolveSkills(req.requiredSkills()))
                .targetDepartments(req.targetDepartments() != null ? new HashSet<>(req.targetDepartments()) : new HashSet<>())
                .build();
        return OpportunityMapper.toResearchResponse(researchRepository.save(research));
    }

    @Override
    @Transactional
    public ResearchResponse update(Long id, ResearchRequest req) {
        ResearchOpportunity research = researchRepository.findWithDetailsById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Research opportunity", id));
        assertOwnership(research.getFaculty());
        if (req.topic() != null) research.setTopic(req.topic());
        if (req.researchArea() != null) research.setResearchArea(req.researchArea());
        if (req.minCgpa() != null) research.setMinCgpa(req.minCgpa());
        if (req.duration() != null) research.setDuration(req.duration());
        if (req.supervisor() != null) research.setSupervisor(req.supervisor());
        if (req.requiredSkills() != null) research.setRequiredSkills(resolveSkills(req.requiredSkills()));
        if (req.targetDepartments() != null) research.setTargetDepartments(new HashSet<>(req.targetDepartments()));
        return OpportunityMapper.toResearchResponse(researchRepository.save(research));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ResearchOpportunity research = researchRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Research opportunity", id));
        assertOwnership(research.getFaculty());
        researchRepository.delete(research);
    }

    @Override
    @Transactional(readOnly = true)
    public ResearchResponse getById(Long id) {
        return OpportunityMapper.toResearchResponse(
                researchRepository.findWithDetailsById(id)
                        .orElseThrow(() -> ResourceNotFoundException.of("Research opportunity", id)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResearchResponse> search(String topic, String area, String faculty) {
        Specification<ResearchOpportunity> spec = Specification.where(ResearchSpecifications.isActive())
                .and(ResearchSpecifications.topicContains(topic))
                .and(ResearchSpecifications.areaContains(area))
                .and(ResearchSpecifications.facultyNameContains(faculty));
        return researchRepository.findAll(spec).stream()
                .map(OpportunityMapper::toResearchResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResearchResponse> listMine() {
        return researchRepository.findByFaculty_Id(currentUser.currentFaculty().getId())
                .stream().map(OpportunityMapper::toResearchResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchedResearchResponse> getMatchedForCurrentStudent() {
        Student student = studentRepository.findWithDetailsById(currentUser.currentStudent().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return researchRepository.findAllByStatus(PostStatus.ACTIVE).stream()
                .map(r -> {
                    MatchBreakdownResponse m = matchingEngine.score(
                            student, r.getRequiredSkills(), r.getMinCgpa(), r.getTargetDepartments());
                    return new MatchedResearchResponse(OpportunityMapper.toResearchResponse(r), m);
                })
                .sorted(Comparator.comparingDouble((MatchedResearchResponse r) -> r.match().finalScore()).reversed())
                .toList();
    }

    private Set<Skill> resolveSkills(List<SkillRequest> requested) {
        if (requested == null) return new HashSet<>();
        return requested.stream()
                .map(skillService::resolveOrCreate)
                .collect(Collectors.toCollection(HashSet::new));
    }

    private void assertOwnership(Faculty owner) {
        if (owner == null || !owner.getId().equals(currentUser.currentFaculty().getId())) {
            throw new ForbiddenOperationException("You do not own this research post");
        }
    }
}
