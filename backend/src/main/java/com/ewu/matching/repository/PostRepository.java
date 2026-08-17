package com.ewu.matching.repository;

import com.ewu.matching.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findTop100ByDeletedFalseOrderByCreatedAtDesc();

    List<Post> findByDeletedFalseOrderByCreatedAtDesc();

    List<Post> findByAuthor_IdAndDeletedFalseOrderByCreatedAtDesc(Long authorId);

    List<Post> findTop50ByContentContainingIgnoreCaseAndDeletedFalseOrderByCreatedAtDesc(String query);

    long countByDeletedFalse();
}
