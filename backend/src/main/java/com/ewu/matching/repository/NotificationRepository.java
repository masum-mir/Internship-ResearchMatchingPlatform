package com.ewu.matching.repository;

import com.ewu.matching.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findTop100ByRecipient_IdOrderByCreatedAtDesc(Long recipientId);

    List<Notification> findByRecipient_IdOrderByCreatedAtDesc(Long recipientId);

    long countByRecipient_IdAndReadFalse(Long recipientId);
}
