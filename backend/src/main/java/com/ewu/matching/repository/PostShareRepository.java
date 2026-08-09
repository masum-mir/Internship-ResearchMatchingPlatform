package com.ewu.matching.repository;

import com.ewu.matching.entity.PostShare;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PostShareRepository extends JpaRepository<PostShare, Long> {
    Optional<PostShare> findByPost_IdAndUser_Id(Long postId, Long userId);

    long countByPost_Id(Long postId);
}
