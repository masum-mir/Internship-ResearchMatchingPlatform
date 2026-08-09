package com.ewu.matching.dto.request;
import jakarta.validation.constraints.NotNull;
public record EndorseSkillRequest(@NotNull Long studentId, @NotNull Long skillId) {}
