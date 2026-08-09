package com.ewu.matching.service.impl;

import com.ewu.matching.dto.response.SkillEndorsementResponse;
import com.ewu.matching.entity.*;
import com.ewu.matching.enums.NotificationType;
import com.ewu.matching.exception.*;
import com.ewu.matching.repository.*;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillEndorsementServiceImpl implements SkillEndorsementService {
    private final SkillEndorsementRepository repository;
    private final StudentRepository studentRepository;
    private final SkillRepository skillRepository;
    private final CurrentUserProvider currentUser;
    private final ProfileLookupService profileLookup;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public SkillEndorsementResponse endorse(Long studentId, Long skillId) {
        User me = currentUser.currentUser();
        Student s = studentRepository.findWithDetailsById(studentId)
                .orElseThrow(() -> ResourceNotFoundException.of("Student", studentId));
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> ResourceNotFoundException.of("Skill", skillId));
        if (s.getUser().getId().equals(me.getId()))
            throw new BadRequestException("You cannot endorse yourself");
        if (s.getSkills().stream().noneMatch(x -> x.getId().equals(skillId)))
            throw new BadRequestException("Student does not list this skill");
        if (repository.findByStudent_IdAndSkill_IdAndEndorsedBy_Id(studentId, skillId, me.getId()).isPresent())
            throw new DuplicateResourceException("You already endorsed this skill");
        SkillEndorsement e = repository.save(SkillEndorsement.builder().student(s).skill(skill).endorsedBy(me).build());
        notificationService.create(s.getUser(), me, NotificationType.SKILL_ENDORSED,
                profileLookup.displayName(me) + " endorsed your " + skill.getName() + " skill", "SKILL", skillId);
        return map(e);
    }

    @Override
    @Transactional
    public void removeMine(Long studentId, Long skillId) {
        User me = currentUser.currentUser();
        SkillEndorsement e = repository.findByStudent_IdAndSkill_IdAndEndorsedBy_Id(studentId, skillId, me.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Endorsement not found"));
        repository.delete(e);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillEndorsementResponse> list(Long studentId, Long skillId) {
        return repository.findByStudent_IdAndSkill_IdOrderByCreatedAtDesc(studentId, skillId).stream().map(this::map)
                .toList();
    }

    private SkillEndorsementResponse map(SkillEndorsement e) {
        return new SkillEndorsementResponse(e.getId(), e.getStudent().getId(), e.getSkill().getId(),
                e.getSkill().getName(), e.getEndorsedBy().getId(), profileLookup.displayName(e.getEndorsedBy()),
                e.getCreatedAt());
    }
}
