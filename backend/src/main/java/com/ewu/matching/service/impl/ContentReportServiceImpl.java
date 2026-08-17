package com.ewu.matching.service.impl;

import com.ewu.matching.dto.request.ContentReportRequest;
import com.ewu.matching.dto.response.ContentReportResponse;
import com.ewu.matching.entity.Comment;
import com.ewu.matching.entity.ContentReport;
import com.ewu.matching.entity.Message;
import com.ewu.matching.entity.Post;
import com.ewu.matching.entity.User;
import com.ewu.matching.enums.ContentReportStatus;
import com.ewu.matching.enums.NotificationType;
import com.ewu.matching.enums.ReportCategoryRules;
import com.ewu.matching.enums.ReportTargetType;
import com.ewu.matching.enums.RoleType;
import com.ewu.matching.exception.BadRequestException;
import com.ewu.matching.exception.ForbiddenOperationException;
import com.ewu.matching.exception.ResourceNotFoundException;
import com.ewu.matching.repository.CommentRepository;
import com.ewu.matching.repository.ContentReportRepository;
import com.ewu.matching.repository.MessageRepository;
import com.ewu.matching.repository.PostRepository;
import com.ewu.matching.repository.UserRepository;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.ContentReportService;
import com.ewu.matching.service.NotificationService;
import com.ewu.matching.service.ProfileLookupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContentReportServiceImpl implements ContentReportService {

    private final ContentReportRepository contentReportRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final MessageRepository messageRepository;
    private final CurrentUserProvider currentUserProvider;
    private final ProfileLookupService profileLookupService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ContentReportResponse reportPost(Long postId, ContentReportRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> ResourceNotFoundException.of("Post", postId));

        User reporter = currentUserProvider.currentUser();
        if (post.getAuthor().getId().equals(reporter.getId())) {
            throw new ForbiddenOperationException("You can't report your own post");
        }

        requireValidCategory(ReportTargetType.POST, request);
        ensureNotAlreadyReported(reporter.getId(), ReportTargetType.POST, postId);

        ContentReport report = ContentReport.builder()
                .reporter(reporter)
                .targetType(ReportTargetType.POST)
                .targetId(postId)
                .targetOwner(post.getAuthor())
                .category(request.category())
                .details(request.details())
                .contentSnapshot(post.getContent())
                .status(ContentReportStatus.PENDING)
                .build();

        ContentReport saved = contentReportRepository.save(report);
        notifyAdmins(reporter, saved, "post");
        return toResponse(saved);
    }

    @Override
    @Transactional
    public ContentReportResponse reportComment(Long commentId, ContentReportRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> ResourceNotFoundException.of("Comment", commentId));

        User reporter = currentUserProvider.currentUser();
        if (comment.getAuthor().getId().equals(reporter.getId())) {
            throw new ForbiddenOperationException("You can't report your own comment");
        }

        requireValidCategory(ReportTargetType.COMMENT, request);
        ensureNotAlreadyReported(reporter.getId(), ReportTargetType.COMMENT, commentId);

        ContentReport report = ContentReport.builder()
                .reporter(reporter)
                .targetType(ReportTargetType.COMMENT)
                .targetId(commentId)
                .postId(comment.getPost().getId())
                .targetOwner(comment.getAuthor())
                .category(request.category())
                .details(request.details())
                .contentSnapshot(comment.getContent())
                .status(ContentReportStatus.PENDING)
                .build();

        ContentReport saved = contentReportRepository.save(report);
        notifyAdmins(reporter, saved, "comment");
        return toResponse(saved);
    }

    @Override
    @Transactional
    public ContentReportResponse reportMessage(Long messageId, ContentReportRequest request) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> ResourceNotFoundException.of("Message", messageId));

        User reporter = currentUserProvider.currentUser();
        if (message.getSender().getId().equals(reporter.getId())) {
            throw new ForbiddenOperationException("You can't report your own message");
        }

        boolean participant = message.getConversation().getParticipants().stream()
                .anyMatch(p -> p.getId().equals(reporter.getId()));
        if (!participant) {
            throw new ForbiddenOperationException("You can only report messages in your own conversations");
        }

        requireValidCategory(ReportTargetType.MESSAGE, request);
        ensureNotAlreadyReported(reporter.getId(), ReportTargetType.MESSAGE, messageId);

        ContentReport report = ContentReport.builder()
                .reporter(reporter)
                .targetType(ReportTargetType.MESSAGE)
                .targetId(messageId)
                .conversationId(message.getConversation().getId())
                .targetOwner(message.getSender())
                .category(request.category())
                .details(request.details())
                .contentSnapshot(message.getContent())
                .status(ContentReportStatus.PENDING)
                .build();

        ContentReport saved = contentReportRepository.save(report);
        notifyAdmins(reporter, saved, "message");
        return toResponse(saved);
    }

    @Override
    @Transactional
    public ContentReportResponse reportProfile(Long userId, ContentReportRequest request) {
        User target = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));

        User reporter = currentUserProvider.currentUser();
        if (target.getId().equals(reporter.getId())) {
            throw new ForbiddenOperationException("You can't report your own profile");
        }

        requireValidCategory(ReportTargetType.PROFILE, request);
        ensureNotAlreadyReported(reporter.getId(), ReportTargetType.PROFILE, userId);

        ContentReport report = ContentReport.builder()
                .reporter(reporter)
                .targetType(ReportTargetType.PROFILE)
                .targetId(userId)
                .targetOwner(target)
                .category(request.category())
                .details(request.details())
                .status(ContentReportStatus.PENDING)
                .build();

        ContentReport saved = contentReportRepository.save(report);
        notifyAdmins(reporter, saved, "profile");
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContentReportResponse> list(String status) {
        List<ContentReport> reports;
        if (status == null || status.isBlank() || "ALL".equalsIgnoreCase(status)) {
            reports = contentReportRepository.findAllByOrderByCreatedAtDesc();
        } else {
            ContentReportStatus parsed;
            try {
                parsed = ContentReportStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Unknown report status: " + status);
            }
            reports = contentReportRepository.findByStatusOrderByCreatedAtDesc(parsed);
        }
        return reports.stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public ContentReportResponse resolve(Long reportId) {
        return updateStatus(reportId, ContentReportStatus.RESOLVED);
    }

    @Override
    @Transactional
    public ContentReportResponse dismiss(Long reportId) {
        return updateStatus(reportId, ContentReportStatus.DISMISSED);
    }

    private ContentReportResponse updateStatus(Long reportId, ContentReportStatus status) {
        ContentReport report = contentReportRepository.findById(reportId)
                .orElseThrow(() -> ResourceNotFoundException.of("ContentReport", reportId));
        report.setStatus(status);
        report.setResolvedAt(java.time.LocalDateTime.now());
        report.setResolvedBy(currentUserProvider.currentUser());
        return toResponse(contentReportRepository.save(report));
    }

    // The category options a reporter is shown are already scoped per target
    // type on the frontend, but the backend never trusts that — a request
    // choosing a category outside what's valid for this target type is
    // rejected outright.
    private void requireValidCategory(ReportTargetType type, ContentReportRequest request) {
        if (!ReportCategoryRules.isAllowed(type, request.category())) {
            throw new BadRequestException(
                    "'" + request.category() + "' isn't a valid reason for reporting a " + type.name().toLowerCase());
        }
    }

    // Every admin gets a notification when something is reported, pointing
    // them to the Reported Content moderation page. This is a best-effort side
    // effect: it must never take the report itself down with it, so any failure
    // here (e.g. notification wiring issues) is logged and swallowed rather than
    // propagated, which would otherwise roll back the whole @Transactional
    // method and turn a successfully-captured report into a 500 for the reporter.
    private void notifyAdmins(User reporter, ContentReport report, String targetLabel) {
        try {
            String reporterName = profileLookupService.displayName(reporter);
            String messageText = reporterName + " reported a " + targetLabel + " for " + report.getCategory().name();

            List<User> admins = userRepository.findByRoles_Name(RoleType.ADMIN);
            for (User admin : admins) {
                notificationService.create(admin, reporter, NotificationType.CONTENT_REPORTED, messageText,
                        "CONTENT_REPORT", report.getId());
            }
        } catch (Exception e) {
            log.error("Failed to notify admins about {} report {} (report itself still saved): ", targetLabel,
                    report.getId(), e);
        }
    }

    private void ensureNotAlreadyReported(Long reporterId, ReportTargetType type, Long targetId) {
        boolean exists = contentReportRepository.existsByReporter_IdAndTargetTypeAndTargetIdAndStatus(
                reporterId, type, targetId, ContentReportStatus.PENDING);
        if (exists) {
            throw new BadRequestException("You've already reported this — it's pending review");
        }
    }

    // Falls back to looking up the conversation through the message itself for
    // reports created before conversationId was captured on the entity, so old
    // rows don't send the frontend a null id.
    private Long resolveConversationId(ContentReport r) {
        if (r.getConversationId() != null) {
            return r.getConversationId();
        }
        if (r.getTargetType() == ReportTargetType.MESSAGE) {
            return messageRepository.findById(r.getTargetId())
                    .map(m -> m.getConversation().getId())
                    .orElse(null);
        }
        return null;
    }

    private ContentReportResponse toResponse(ContentReport r) {
        String reporterName = profileLookupService.displayName(r.getReporter());
        String ownerName = r.getTargetOwner() != null ? profileLookupService.displayName(r.getTargetOwner()) : null;
        return new ContentReportResponse(
                r.getId(),
                r.getReporter().getId(),
                reporterName,
                r.getTargetType(),
                r.getTargetId(),
                resolveConversationId(r),
                r.getPostId(),
                r.getTargetOwner() != null ? r.getTargetOwner().getId() : null,
                ownerName,
                r.getCategory(),
                r.getDetails(),
                r.getContentSnapshot(),
                r.getStatus(),
                r.getCreatedAt(),
                r.getResolvedAt()
        );
    }
}
