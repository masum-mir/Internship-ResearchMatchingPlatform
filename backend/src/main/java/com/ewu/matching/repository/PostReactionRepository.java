package com.ewu.matching.repository;

import com.ewu.matching.entity.PostReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PostReactionRepository extends JpaRepository<PostReaction, Long> {
    Optional<PostReaction> findByPost_IdAndUser_Id(Long postId, Long userId);

    List<PostReaction> findByPost_Id(Long postId);

    long countByPost_Id(Long postId);
}
