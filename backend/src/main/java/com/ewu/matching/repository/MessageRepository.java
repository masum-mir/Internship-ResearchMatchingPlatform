package com.ewu.matching.repository;

import com.ewu.matching.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversation_IdOrderBySentAtAsc(Long conversationId);
}
