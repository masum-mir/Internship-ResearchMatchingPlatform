package com.ewu.matching.dto.response;
import com.ewu.matching.enums.PostVisibility;
import com.ewu.matching.enums.ReactionType;
import java.time.LocalDateTime;
import java.util.Map;
public record PostResponse(Long id, Long authorId, String authorName, String authorRole, String authorProfilePicture,
                           String content, String mediaUrl, String mediaType, PostVisibility visibility, boolean edited,
                           LocalDateTime createdAt, LocalDateTime updatedAt, long reactionCount,
                           Map<ReactionType, Long> reactions, long commentCount, long shareCount,
                           ReactionType myReaction, boolean savedByMe) {}
