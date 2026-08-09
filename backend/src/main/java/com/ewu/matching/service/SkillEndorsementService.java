package com.ewu.matching.service;

import com.ewu.matching.dto.response.SkillEndorsementResponse;
import java.util.List;

public interface SkillEndorsementService {
    SkillEndorsementResponse endorse(Long studentId, Long skillId);

    void removeMine(Long studentId, Long skillId);

    List<SkillEndorsementResponse> list(Long studentId, Long skillId);
}
