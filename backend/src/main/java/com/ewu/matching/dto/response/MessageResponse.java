package com.ewu.matching.dto.response;
import java.time.LocalDateTime;
public record MessageResponse(Long id, Long conversationId, Long senderId, String senderName,
                              String content, String attachmentUrl, boolean read,
                              LocalDateTime sentAt, LocalDateTime readAt) {}
