package com.ewu.matching.service;

import com.ewu.matching.dto.response.NotificationResponse;
import com.ewu.matching.entity.User;
import com.ewu.matching.enums.NotificationType;
import java.util.List;

public interface NotificationService {
    List<NotificationResponse> mine();

    long unreadCount();

    void markRead(Long id);

    void markAllRead();

    void create(User recipient, User actor, NotificationType type, String message, String referenceType,
            Long referenceId);
}
