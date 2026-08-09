package com.ewu.matching.dto.response;
import com.ewu.matching.enums.NotificationType;
import java.time.LocalDateTime;
public record NotificationResponse(Long id, Long actorId, String actorName, NotificationType type,
                                   String message, String referenceType, Long referenceId,
                                   boolean read, LocalDateTime createdAt) {}
