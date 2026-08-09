package com.ewu.matching.dto.request;
import jakarta.validation.constraints.NotNull;
public record StartConversationRequest(@NotNull Long userId) {}
