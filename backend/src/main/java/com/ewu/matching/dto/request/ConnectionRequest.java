package com.ewu.matching.dto.request;
import jakarta.validation.constraints.NotNull;
public record ConnectionRequest(@NotNull Long userId) {}
