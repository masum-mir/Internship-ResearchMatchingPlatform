package com.ewu.matching.repository;

import com.ewu.matching.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPost_IdAndDeletedFalseOrderByCreatedAtAsc(Long postId);

    long countByPost_IdAndDeletedFalse(Long postId);
}
