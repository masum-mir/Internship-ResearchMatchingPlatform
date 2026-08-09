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
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResearchServiceImpl implements ResearchService {
        private final FacultyRepository facultyRepository; // ADD
        private final ResearchOpportunityRepository researchRepository;
        private final StudentRepository studentRepository;
        private final SkillService skillService;
        private final MatchingEngine matchingEngine;
        private final CurrentUserProvider currentUser;
        private final UserFollowRepository followRepository;
        private final NotificationService notificationService;

        @Override
        @Transactional
        public ResearchResponse create(ResearchRequest r) {
                Faculty f = currentUser.currentFaculty();
                ResearchOpportunity x = ResearchOpportunity.builder().faculty(f).topic(r.topic())
                                .researchArea(r.researchArea()).description(r.description())
                                .eligibility(r.eligibility()).responsibilities(r.responsibilities())
                                .minCgpa(r.minCgpa()).duration(r.duration()).availablePositions(r.availablePositions())
                                .applicationDeadline(r.applicationDeadline()).location(r.location())
                                .workMode(r.workMode()).funded(Boolean.TRUE.equals(r.funded()))
                                .stipendAmount(r.stipendAmount()).stipendCurrency(r.stipendCurrency())
                                .status(PostStatus.ACTIVE).requiredSkills(resolveSkills(r.requiredSkills()))
                                .targetDepartments(r.targetDepartments() != null ? new HashSet<>(r.targetDepartments())
                                                : new HashSet<>())
                                .build();
                x = researchRepository.save(x);
                for (UserFollow u : followRepository.findByFollowing_IdOrderByCreatedAtDesc(f.getUser().getId()))
                        notificationService.create(u.getFollower(), f.getUser(), NotificationType.NEW_OPPORTUNITY,
                                        f.getName() + " posted a research opportunity: " + x.getTopic(), "RESEARCH",
                                        x.getId());
                return OpportunityMapper.toResearchResponse(x);
        }

        @Override
        @Transactional
        public ResearchResponse update(Long id, ResearchRequest r) {
                ResearchOpportunity x = researchRepository.findWithDetailsById(id)
                                .orElseThrow(() -> ResourceNotFoundException.of("Research opportunity", id));
                assertOwnership(x.getFaculty());
                if (r.topic() != null)
                        x.setTopic(r.topic());
                if (r.researchArea() != null)
                        x.setResearchArea(r.researchArea());
                if (r.description() != null)
                        x.setDescription(r.description());
                if (r.eligibility() != null)
                        x.setEligibility(r.eligibility());
                if (r.responsibilities() != null)
                        x.setResponsibilities(r.responsibilities());
                if (r.minCgpa() != null)
                        x.setMinCgpa(r.minCgpa());
                if (r.duration() != null)
                        x.setDuration(r.duration());
                if (r.availablePositions() != null)
                        x.setAvailablePositions(r.availablePositions());
                if (r.applicationDeadline() != null)
                        x.setApplicationDeadline(r.applicationDeadline());
                if (r.location() != null)
                        x.setLocation(r.location());
                if (r.workMode() != null)
                        x.setWorkMode(r.workMode());
                if (r.funded() != null)
                        x.setFunded(r.funded());
                if (r.stipendAmount() != null)
                        x.setStipendAmount(r.stipendAmount());
                if (r.stipendCurrency() != null)
                        x.setStipendCurrency(r.stipendCurrency());
                if (r.requiredSkills() != null)
                        x.setRequiredSkills(resolveSkills(r.requiredSkills()));
                if (r.targetDepartments() != null)
                        x.setTargetDepartments(new HashSet<>(r.targetDepartments()));
                return OpportunityMapper.toResearchResponse(researchRepository.save(x));
        }

        @Override
        @Transactional
        public void delete(Long id) {
                ResearchOpportunity x = researchRepository.findById(id)
                                .orElseThrow(() -> ResourceNotFoundException.of("Research opportunity", id));
                assertOwnership(x.getFaculty());
                researchRepository.delete(x);
        }

        @Override
        @Transactional(readOnly = true)
        public ResearchResponse getById(Long id) {
                return OpportunityMapper.toResearchResponse(researchRepository.findWithDetailsById(id)
                                .orElseThrow(() -> ResourceNotFoundException.of("Research opportunity", id)));
        }

        @Override
        @Transactional(readOnly = true)
        public List<ResearchResponse> search(String topic, String area, String faculty) {
                Specification<ResearchOpportunity> spec = Specification.where(ResearchSpecifications.isActive())
                                .and(ResearchSpecifications.topicContains(topic))
                                .and(ResearchSpecifications.areaContains(area))
                                .and(ResearchSpecifications.facultyNameContains(faculty));
                return researchRepository.findAll(spec).stream().map(OpportunityMapper::toResearchResponse).toList();
        }

        // @Override @Transactional(readOnly=true) public List<ResearchResponse>
        // listMine(){return
        // researchRepository.findByFaculty_Id(currentUser.currentFaculty().getId()).stream().map(OpportunityMapper::toResearchResponse).toList();}
        @Override
        @Transactional(readOnly = true)
        public List<MatchedResearchResponse> getMatchedForCurrentStudent() {
                Student s = studentRepository.findWithDetailsById(currentUser.currentStudent().getId())
                                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
                return researchRepository.findAllByStatus(PostStatus.ACTIVE).stream()
                                .filter(r -> r.getApplicationDeadline() == null
                                                || r.getApplicationDeadline().isAfter(java.time.LocalDateTime.now()))
                                .map(r -> {
                                        MatchBreakdownResponse m = matchingEngine.score(s, r.getRequiredSkills(),
                                                        r.getMinCgpa(), r.getTargetDepartments());
                                        return new MatchedResearchResponse(OpportunityMapper.toResearchResponse(r), m);
                                })
                                .sorted(Comparator
                                                .comparingDouble((MatchedResearchResponse x) -> x.match().finalScore())
                                                .reversed())
                                .toList();
        }

        private Set<Skill> resolveSkills(List<SkillRequest> r) {
                if (r == null)
                        return new HashSet<>();
                return r.stream().map(skillService::resolveOrCreate).collect(Collectors.toCollection(HashSet::new));
        }

        private void assertOwnership(Faculty f) {
                if (f == null || !f.getId().equals(currentUser.currentFaculty().getId()))
                        throw new ForbiddenOperationException("You do not own this research post");
        }

        @Override
        @Transactional(readOnly = true)
        public List<ResearchResponse> listMine() {

                User me = currentUser.currentUser();

                List<ResearchOpportunity> posts = researchRepository.findByFaculty_User_Id(me.getId());

                if (posts.isEmpty()) {
                        return List.of();
                }

                return posts.stream()
                                .map(OpportunityMapper::toResearchResponse)
                                .toList();
        }
}
