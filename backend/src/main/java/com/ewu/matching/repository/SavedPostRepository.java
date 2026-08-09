package com.ewu.matching.repository;
import com.ewu.matching.entity.SavedPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface SavedPostRepository extends JpaRepository<SavedPost, Long> {
    Optional<SavedPost> findByUser_IdAndPost_Id(Long userId, Long postId);
    boolean existsByUser_IdAndPost_Id(Long userId, Long postId);
    List<SavedPost> findByUser_IdOrderByCreatedAtDesc(Long userId);
}
