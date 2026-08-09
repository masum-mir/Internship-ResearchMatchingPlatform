package com.ewu.matching.repository;

import com.ewu.matching.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findDistinctByParticipants_IdOrderByUpdatedAtDesc(Long userId);
}
