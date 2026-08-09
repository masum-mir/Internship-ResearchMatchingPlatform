package com.ewu.matching.dto.response;
import java.time.LocalDateTime;
public record SkillEndorsementResponse(Long id, Long studentId, Long skillId, String skillName,
                                       Long endorsedById, String endorsedByName, LocalDateTime createdAt) {}
