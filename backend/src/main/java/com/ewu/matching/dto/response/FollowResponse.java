package com.ewu.matching.dto.response;
import java.time.LocalDateTime;
public record FollowResponse(Long id, Long followerId, String followerName, Long followingId,
                             String followingName, LocalDateTime createdAt) {}
