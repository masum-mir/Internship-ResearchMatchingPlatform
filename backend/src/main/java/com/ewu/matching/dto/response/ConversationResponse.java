package com.ewu.matching.dto.response;
import java.time.LocalDateTime;
import java.util.Set;
public record ConversationResponse(Long id, Set<ProfileSummaryResponse> participants,
                                   LocalDateTime createdAt, LocalDateTime updatedAt) {}
