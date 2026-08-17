package com.ewu.matching.dto.response;
import java.time.LocalDateTime;
public record FollowResponse(Long id, Long followerId, String followerName, String followerPhoto,
                             Long followingId, String followingName, String followingPhoto,
                             LocalDateTime createdAt) {}
