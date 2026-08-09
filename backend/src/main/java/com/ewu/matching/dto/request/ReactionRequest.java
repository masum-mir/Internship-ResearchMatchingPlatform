package com.ewu.matching.dto.request;
import com.ewu.matching.enums.ReactionType;
import jakarta.validation.constraints.NotNull;
public record ReactionRequest(@NotNull ReactionType type) {}
