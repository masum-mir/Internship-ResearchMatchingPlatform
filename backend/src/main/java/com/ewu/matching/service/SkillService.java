package com.ewu.matching.service;

import com.ewu.matching.dto.request.SkillRequest;
import com.ewu.matching.entity.Skill;
import com.ewu.matching.enums.SkillCategory;

public interface SkillService {
    /** Find a skill by name (case-insensitive) or create it. */
    Skill resolveOrCreate(String name, SkillCategory category);
    Skill resolveOrCreate(SkillRequest request);
}
