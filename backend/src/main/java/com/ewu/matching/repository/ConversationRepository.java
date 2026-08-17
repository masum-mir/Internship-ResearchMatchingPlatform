package com.ewu.matching.repository;

import com.ewu.matching.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findDistinctByParticipants_IdOrderByUpdatedAtDesc(Long userId);

    List<Conversation> findAllByOrderByUpdatedAtDesc();

    @Query("select c from Conversation c join c.participants p1 join c.participants p2 "
            + "where p1.id = :userA and p2.id = :userB and size(c.participants) = 2")
    Optional<Conversation> findDirectBetween(@Param("userA") Long userA, @Param("userB") Long userB);
}
