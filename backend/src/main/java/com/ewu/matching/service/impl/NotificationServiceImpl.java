package com.ewu.matching.service.impl;

import com.ewu.matching.dto.response.NotificationResponse;
import com.ewu.matching.entity.Notification;
import com.ewu.matching.entity.User;
import com.ewu.matching.enums.NotificationType;
import com.ewu.matching.exception.ForbiddenOperationException;
import com.ewu.matching.exception.ResourceNotFoundException;
import com.ewu.matching.repository.NotificationRepository;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.NotificationService;
import com.ewu.matching.service.ProfileLookupService;
import com.ewu.matching.service.UserVisibilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository repository;
    private final CurrentUserProvider currentUser;
    private final ProfileLookupService profileLookup;
    private final UserVisibilityService userVisibility;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> mine() {
        return repository.findTop100ByRecipient_IdOrderByCreatedAtDesc(currentUser.currentUser().getId())
                .stream().filter(this::isVisibleToRecipient).map(this::map).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long unreadCount() {
        return repository.findByRecipient_IdOrderByCreatedAtDesc(currentUser.currentUser().getId()).stream()
                .filter(notification -> !notification.isRead() && isVisibleToRecipient(notification)).count();
    }

    @Override
    @Transactional
    public void markRead(Long id) {
        Notification n = repository.findById(id).orElseThrow(() -> ResourceNotFoundException.of("Notification", id));
        if (!n.getRecipient().getId().equals(currentUser.currentUser().getId()))
            throw new ForbiddenOperationException("You do not own this notification");
        n.setRead(true);
        repository.save(n);
    }

    @Override
    @Transactional
    public void markAllRead() {
        repository.findByRecipient_IdOrderByCreatedAtDesc(currentUser.currentUser().getId())
                .forEach(n -> n.setRead(true));
    }

    @Override
    @Transactional
    public void create(User recipient, User actor, NotificationType type, String message, String referenceType,
            Long referenceId) {
        if (recipient == null)
            return;
        if (actor != null && actor.getId().equals(recipient.getId()))
            return;
        if (actor != null && userVisibility.isAdmin(actor))
            return;
        repository.save(Notification.builder().recipient(recipient).actor(actor).type(type).message(message)
                .referenceType(referenceType).referenceId(referenceId).read(false).build());
    }

    private boolean isVisibleToRecipient(Notification notification) {
        return notification.getActor() == null || !userVisibility.isAdmin(notification.getActor());
    }

    private NotificationResponse map(Notification n) {
        return new NotificationResponse(n.getId(), n.getActor() == null ? null : n.getActor().getId(),
                n.getActor() == null ? null : profileLookup.displayName(n.getActor()), n.getType(), n.getMessage(),
                n.getReferenceType(), n.getReferenceId(), n.isRead(), n.getCreatedAt());
    }
}
