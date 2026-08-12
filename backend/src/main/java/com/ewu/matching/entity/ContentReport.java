package com.ewu.matching.entity;

import com.ewu.matching.enums.ContentReportStatus;
import com.ewu.matching.enums.ReportCategory;
import com.ewu.matching.enums.ReportTargetType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "content_reports", indexes = {
        @Index(name = "idx_content_reports_status", columnList = "status"),
        @Index(name = "idx_content_reports_target", columnList = "target_type, target_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ContentReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false, length = 20)
    private ReportTargetType targetType;

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    // Only set for MESSAGE reports — lets admins open the conversation
    // read-only even if the message is later deleted.
    @Column(name = "conversation_id")
    private Long conversationId;

    // Only set for COMMENT reports — lets admins open the parent post for
    // context even if the comment is later deleted.
    @Column(name = "post_id")
    private Long postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_owner_id")
    private User targetOwner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ReportCategory category;

    @Column(columnDefinition = "TEXT")
    private String details;

    // Snapshot of the reported content's text at the moment it was reported,
    // so the report is still meaningful even if the content is later edited or deleted.
    @Column(name = "content_snapshot", columnDefinition = "TEXT")
    private String contentSnapshot;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 20)
    private ContentReportStatus status = ContentReportStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by_id")
    private User resolvedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
