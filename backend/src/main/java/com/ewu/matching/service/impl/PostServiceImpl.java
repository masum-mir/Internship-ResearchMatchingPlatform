package com.ewu.matching.service.impl;

import com.ewu.matching.dto.request.*;
import com.ewu.matching.dto.response.*;
import com.ewu.matching.entity.*;
import com.ewu.matching.enums.*;
import com.ewu.matching.exception.*;
import com.ewu.matching.repository.*;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final PostReactionRepository reactionRepository;
    private final CommentRepository commentRepository;
    private final PostShareRepository shareRepository;
    private final SavedPostRepository savedRepository;
    private final ConnectionRepository connectionRepository;
    private final UserFollowRepository followRepository;
    private final CurrentUserProvider currentUser;
    private final NotificationService notificationService;
    private final ProfileLookupService profileLookup;
    private final UserVisibilityService userVisibility;

    @Override
    @Transactional
    public PostResponse create(PostCreateRequest r) {
        validateBody(r.content(), r.mediaUrl());
        User me = currentUser.currentUser();
        Post p = postRepository.save(Post.builder().author(me).content(clean(r.content())).mediaUrl(clean(r.mediaUrl()))
                .mediaType(clean(r.mediaType()))
                .visibility(r.visibility() == null ? PostVisibility.PUBLIC : r.visibility()).build());
        return map(p, me);
    }

    @Override
    @Transactional
    public PostResponse update(Long id, PostUpdateRequest r) {
        User me = currentUser.currentUser();
        Post p = requirePost(id);
        owner(p, me);
        validateBody(r.content(), r.mediaUrl());
        p.setContent(clean(r.content()));
        p.setMediaUrl(clean(r.mediaUrl()));
        p.setMediaType(clean(r.mediaType()));
        if (r.visibility() != null)
            p.setVisibility(r.visibility());
        p.setEdited(true);
        return map(postRepository.save(p), me);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        User me = currentUser.currentUser();
        Post p = requirePost(id);
        owner(p, me);
        p.setDeleted(true);
        p.setContent(null);
        p.setMediaUrl(null);
        postRepository.save(p);
    }

    @Override
    @Transactional(readOnly = true)
    public PostResponse getById(Long id) {
        User me = currentUser.currentUser();
        Post p = requirePost(id);
        userVisibility.requirePublicUser(p.getAuthor());
        visible(p, me, true);
        return map(p, me);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponse> feed() {
        User me = currentUser.currentUser();
        Set<Long> network = relevantAuthorIds(me);
        return postRepository.findTop100ByDeletedFalseOrderByCreatedAtDesc().stream()
                .filter(p -> network.contains(p.getAuthor().getId()) && canView(p, me))
                .filter(p -> !userVisibility.isAdmin(p.getAuthor()))
                .map(p -> map(p, me)).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponse> mine() {
        User me = currentUser.currentUser();
        return postRepository.findByAuthor_IdAndDeletedFalseOrderByCreatedAtDesc(me.getId()).stream()
                .map(p -> map(p, me)).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponse> search(String query) {
        if (query == null || query.isBlank())
            return feed();
        User me = currentUser.currentUser();
        return postRepository.findTop50ByContentContainingIgnoreCaseAndDeletedFalseOrderByCreatedAtDesc(query.trim())
                .stream().filter(p -> !userVisibility.isAdmin(p.getAuthor()) && canView(p, me)).map(p -> map(p, me)).toList();
    }

    @Override
    @Transactional
    public PostResponse react(Long id, ReactionRequest request) {
        User me = currentUser.currentUser();
        Post p = requirePost(id);
        visible(p, me, true);
        Optional<PostReaction> existing = reactionRepository.findByPost_IdAndUser_Id(id, me.getId());
        PostReaction reaction = existing.orElseGet(() -> PostReaction.builder().post(p).user(me).build());
        reaction.setType(request.type());
        reactionRepository.save(reaction);
        if (existing.isEmpty()) {
            notificationService.create(p.getAuthor(), me, NotificationType.POST_REACTED,
                    profileLookup.displayName(me) + " reacted to your post", "POST", p.getId());
        }
        return map(p, me);
    }

    @Override
    @Transactional
    public PostResponse removeReaction(Long id) {
        User me = currentUser.currentUser();
        Post p = requirePost(id);
        reactionRepository.findByPost_IdAndUser_Id(id, me.getId()).ifPresent(reactionRepository::delete);
        return map(p, me);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostReactionResponse> reactions(Long id) {
        User me = currentUser.currentUser();
        Post post = requirePost(id);
        visible(post, me, true);
        return reactionRepository.findByPost_Id(id).stream()
                .filter(reaction -> !userVisibility.isAdmin(reaction.getUser()))
                .map(reaction -> {
                    var profile = profileLookup.summary(reaction.getUser());
                    return new PostReactionResponse(reaction.getUser().getId(), profile.name(),
                            profile.profilePicture(), reaction.getType());
                })
                .toList();
    }

    @Override
    @Transactional
    public CommentResponse comment(Long id, CommentRequest r) {
        User me = currentUser.currentUser();
        Post p = requirePost(id);
        visible(p, me, true);
        Comment parent = null;
        if (r.parentCommentId() != null) {
            parent = commentRepository.findById(r.parentCommentId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Comment", r.parentCommentId()));
            if (!parent.getPost().getId().equals(id))
                throw new BadRequestException("Parent comment belongs to another post");
        }
        Comment c = commentRepository
                .save(Comment.builder().post(p).author(me).parentComment(parent).content(r.content().trim()).build());
        notificationService.create(p.getAuthor(), me, NotificationType.POST_COMMENTED,
                profileLookup.displayName(me) + " commented on your post", "POST", p.getId());
        return map(c);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> comments(Long id) {
        User me = currentUser.currentUser();
        Post p = requirePost(id);
        visible(p, me, true);
        return commentRepository.findByPost_IdAndDeletedFalseOrderByCreatedAtAsc(id).stream().map(this::map).toList();
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId) {
        User me = currentUser.currentUser();
        Comment c = commentRepository.findById(commentId)
                .orElseThrow(() -> ResourceNotFoundException.of("Comment", commentId));
        if (!c.getAuthor().getId().equals(me.getId()))
            throw new ForbiddenOperationException("You can only delete your own comment");
        c.setDeleted(true);
        c.setContent("[deleted]");
        commentRepository.save(c);
    }

    @Override
    @Transactional
    public void share(Long id, SharePostRequest r) {
        User me = currentUser.currentUser();
        Post p = requirePost(id);
        visible(p, me, true);
        if (p.getVisibility() == PostVisibility.PRIVATE)
            throw new ForbiddenOperationException("Private posts cannot be shared");
        if (shareRepository.findByPost_IdAndUser_Id(id, me.getId()).isPresent())
            throw new DuplicateResourceException("You already shared this post");
        shareRepository.save(PostShare.builder().post(p).user(me).caption(clean(r.caption())).build());
        notificationService.create(p.getAuthor(), me, NotificationType.POST_SHARED,
                profileLookup.displayName(me) + " shared your post", "POST", p.getId());
    }

    @Override
    @Transactional
    public void save(Long id) {
        User me = currentUser.currentUser();
        Post p = requirePost(id);
        visible(p, me, true);
        if (!savedRepository.existsByUser_IdAndPost_Id(me.getId(), id))
            savedRepository.save(SavedPost.builder().user(me).post(p).build());
    }

    @Override
    @Transactional
    public void unsave(Long id) {
        User me = currentUser.currentUser();
        savedRepository.findByUser_IdAndPost_Id(me.getId(), id).ifPresent(savedRepository::delete);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponse> saved() {
        User me = currentUser.currentUser();
        return savedRepository.findByUser_IdOrderByCreatedAtDesc(me.getId()).stream().map(SavedPost::getPost)
                .filter(p -> !p.isDeleted() && canView(p, me)).map(p -> map(p, me)).toList();
    }

    private Post requirePost(Long id) {
        Post p = postRepository.findById(id).orElseThrow(() -> ResourceNotFoundException.of("Post", id));
        if (p.isDeleted())
            throw ResourceNotFoundException.of("Post", id);
        userVisibility.requirePublicUser(p.getAuthor());
        return p;
    }

    private boolean canView(Post p, User me) {
        if (userVisibility.isAdmin(p.getAuthor()))
            return false;
        if (p.getAuthor().getId().equals(me.getId()))
            return true;
        if (connectionRepository.areBlocked(me.getId(), p.getAuthor().getId()))
            return false;
        return p.getVisibility() == PostVisibility.PUBLIC ||
                (p.getVisibility() == PostVisibility.CONNECTIONS_ONLY
                        && connectionRepository.areConnected(me.getId(), p.getAuthor().getId()));
    }

    // Home feed is limited to yourself plus the people you actually have a
    // relationship with (following, or a mutual connection) — not every
    // public post on the platform, so it behaves like a real social feed
    // rather than a firehose of strangers' posts.
    private Set<Long> relevantAuthorIds(User me) {
        Set<Long> ids = new HashSet<>();
        ids.add(me.getId());
        followRepository.findByFollower_IdOrderByCreatedAtDesc(me.getId())
                .forEach(f -> ids.add(f.getFollowing().getId()));
        connectionRepository.findAcceptedForUser(me.getId()).forEach(c -> {
            ids.add(c.getRequester().getId());
            ids.add(c.getAddressee().getId());
        });
        return ids;
    }

    private void visible(Post p, User me, boolean fail) {
        if (!canView(p, me) && fail)
            throw new ForbiddenOperationException("You cannot view this post");
    }

    private void owner(Post p, User me) {
        if (!p.getAuthor().getId().equals(me.getId()))
            throw new ForbiddenOperationException("You can only modify your own post");
    }

    private void validateBody(String content, String media) {
        if (clean(content) == null && clean(media) == null)
            throw new BadRequestException("Post must contain text or media");
    }

    private String clean(String s) {
        if (s == null)
            return null;
        String v = s.trim();
        return v.isEmpty() ? null : v;
    }

    private PostResponse map(Post p, User me) {
        var summary = profileLookup.summary(p.getAuthor());
        EnumMap<ReactionType, Long> breakdown = new EnumMap<>(ReactionType.class);
        for (ReactionType t : ReactionType.values())
            breakdown.put(t, 0L);
        for (PostReaction r : reactionRepository.findByPost_Id(p.getId()))
            breakdown.put(r.getType(), breakdown.get(r.getType()) + 1);
        ReactionType mine = reactionRepository.findByPost_IdAndUser_Id(p.getId(), me.getId()).map(PostReaction::getType)
                .orElse(null);
        return new PostResponse(p.getId(), p.getAuthor().getId(), summary.name(), summary.role(),
                summary.profilePicture(), p.getContent(), p.getMediaUrl(), p.getMediaType(),
                p.getVisibility(), p.isEdited(), p.getCreatedAt(), p.getUpdatedAt(),
                reactionRepository.countByPost_Id(p.getId()), breakdown,
                commentRepository.countByPost_IdAndDeletedFalse(p.getId()), shareRepository.countByPost_Id(p.getId()),
                mine,
                savedRepository.existsByUser_IdAndPost_Id(me.getId(), p.getId()));
    }

    private CommentResponse map(Comment c) {
        var s = profileLookup.summary(c.getAuthor());
        return new CommentResponse(c.getId(), c.getPost().getId(), c.getAuthor().getId(), s.name(), s.profilePicture(),
                c.getParentComment() == null ? null : c.getParentComment().getId(), c.getContent(), c.isEdited(),
                c.getCreatedAt(), c.getUpdatedAt());
    }
}
