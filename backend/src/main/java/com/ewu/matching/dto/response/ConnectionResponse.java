package com.ewu.matching.dto.response;
import com.ewu.matching.enums.ConnectionStatus;
import java.time.LocalDateTime;
public record ConnectionResponse(Long id, Long requesterId, String requesterName, String requesterPhoto,
                                 Long addresseeId, String addresseeName, String addresseePhoto,
                                 ConnectionStatus status, Long blockedById,
                                 LocalDateTime requestedAt, LocalDateTime respondedAt) {}
