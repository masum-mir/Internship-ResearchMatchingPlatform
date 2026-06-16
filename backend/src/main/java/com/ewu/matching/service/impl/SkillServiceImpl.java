package com.ewu.matching.service.impl;

import com.ewu.matching.dto.request.SkillRequest;
import com.ewu.matching.entity.Skill;
import com.ewu.matching.enums.SkillCategory;
import com.ewu.matching.repository.SkillRepository;
import com.ewu.matching.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;

    @Override
    @Transactional
    public Skill resolveOrCreate(String name, SkillCategory category) {
        String clean = name == null ? "" : name.trim();
        return skillRepository.findByNameIgnoreCase(clean)
                .orElseGet(() -> skillRepository.save(
                        Skill.builder()
                                .name(clean)
                                .category(category != null ? category : SkillCategory.TOOL)
                                .build()));
    }

    @Override
    @Transactional
    public Skill resolveOrCreate(SkillRequest request) {
        return resolveOrCreate(request.name(), request.category());
    }
}
