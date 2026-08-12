package com.ewu.matching.dto.response;

import com.ewu.matching.enums.ContentReportStatus;
import com.ewu.matching.enums.ReportCategory;
import com.ewu.matching.enums.ReportTargetType;

import java.time.LocalDateTime;

public record ContentReportResponse(
        Long id,
        Long reporterId,
        String reporterName,
        ReportTargetType targetType,
        Long targetId,
        Long conversationId,
        Long postId,
        Long targetOwnerId,
        String targetOwnerName,
        ReportCategory category,
        String details,
        String contentSnapshot,
        ContentReportStatus status,
        LocalDateTime createdAt,
        LocalDateTime resolvedAt
) {}
