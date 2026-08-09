package com.ewu.matching.dto.response;
import java.time.LocalDateTime;
public record CommentResponse(Long id, Long postId, Long authorId, String authorName, String authorProfilePicture,
                              Long parentCommentId, String content, boolean edited,
                              LocalDateTime createdAt, LocalDateTime updatedAt) {}
