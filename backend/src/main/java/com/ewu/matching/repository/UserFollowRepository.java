package com.ewu.matching.repository;
import com.ewu.matching.entity.UserFollow;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface UserFollowRepository extends JpaRepository<UserFollow, Long> {
    Optional<UserFollow> findByFollower_IdAndFollowing_Id(Long followerId, Long followingId);
    List<UserFollow> findByFollower_IdOrderByCreatedAtDesc(Long followerId);
    List<UserFollow> findByFollowing_IdOrderByCreatedAtDesc(Long followingId);
    long countByFollowing_Id(Long followingId);
}
