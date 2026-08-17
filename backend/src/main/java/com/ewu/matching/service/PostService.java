package com.ewu.matching.service;

import com.ewu.matching.dto.request.*;
import com.ewu.matching.dto.response.*;
import java.util.List;

public interface PostService {
    PostResponse create(PostCreateRequest request);

    PostResponse update(Long id, PostUpdateRequest request);

    void delete(Long id);

    PostResponse getById(Long id);

    List<PostResponse> feed();

    List<PostResponse> mine();

    List<PostResponse> search(String query);

    PostResponse react(Long id, ReactionRequest request);

    PostResponse removeReaction(Long id);

    List<PostReactionResponse> reactions(Long id);

    CommentResponse comment(Long id, CommentRequest request);

    List<CommentResponse> comments(Long id);

    void deleteComment(Long commentId);

    void share(Long id, SharePostRequest request);

    void save(Long id);

    void unsave(Long id);

    List<PostResponse> saved();
}
