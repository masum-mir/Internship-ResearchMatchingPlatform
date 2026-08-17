package com.ewu.matching.service.impl;

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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class NetworkServiceImpl implements NetworkService {
    private final ConnectionRepository connectionRepository;
    private final UserFollowRepository followRepository;
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final CurrentUserProvider currentUser;
    private final NotificationService notificationService;
    private final ProfileLookupService profileLookup;
    private final UserVisibilityService userVisibility;

    @Override
    @Transactional
    public ConnectionResponse requestConnection(Long userId) {
        User me = currentUser.currentUser(), other = user(userId);
        self(me, other);
        Connection existing = connectionRepository.findBetween(me.getId(), other.getId()).orElse(null);
        if (existing != null && existing.getStatus() == ConnectionStatus.BLOCKED)
            throw new ForbiddenOperationException("Connection is blocked");
        if (existing != null && (existing.getStatus() == ConnectionStatus.PENDING
                || existing.getStatus() == ConnectionStatus.ACCEPTED))
            throw new DuplicateResourceException("Connection already exists or is pending");
        if (existing != null)
            connectionRepository.delete(existing);
        Connection c = connectionRepository.save(Connection.builder()
                .requester(me).addressee(other).status(ConnectionStatus.PENDING).build());
        notificationService.create(other, me, NotificationType.CONNECTION_REQUEST,
                profileLookup.displayName(me) + " sent you a connection request", "CONNECTION", c.getId());
        return map(c);
    }

    @Override
    @Transactional
    public ConnectionResponse accept(Long id) {
        User me = currentUser.currentUser();
        Connection c = conn(id);
        if (!c.getAddressee().getId().equals(me.getId()))
            throw new ForbiddenOperationException("Only the recipient can accept this request");
        if (c.getStatus() != ConnectionStatus.PENDING)
            throw new BadRequestException("Connection request is not pending");
        c.setStatus(ConnectionStatus.ACCEPTED);
        c.setRespondedAt(LocalDateTime.now());
        c = connectionRepository.save(c);
        notificationService.create(c.getRequester(), me, NotificationType.CONNECTION_ACCEPTED,
                profileLookup.displayName(me) + " accepted your connection request", "CONNECTION", c.getId());
        return map(c);
    }

    @Override
    @Transactional
    public ConnectionResponse reject(Long id) {
        User me = currentUser.currentUser();
        Connection c = conn(id);
        if (!c.getAddressee().getId().equals(me.getId()))
            throw new ForbiddenOperationException("Only the recipient can reject this request");
        c.setStatus(ConnectionStatus.REJECTED);
        c.setRespondedAt(LocalDateTime.now());
        return map(connectionRepository.save(c));
    }

    @Override
    @Transactional
    public void removeConnection(Long id) {
        User me = currentUser.currentUser();
        Connection c = conn(id);
        if (!member(c, me))
            throw new ForbiddenOperationException("Not your connection");
        Long otherId = c.getRequester().getId().equals(me.getId()) ? c.getAddressee().getId() : c.getRequester().getId();
        connectionRepository.delete(c);
        // Disconnecting also breaks any follow relationship between the two users in
        // either direction — otherwise a lingering follow would keep their posts
        // showing up in each other's home feed even though they're no longer connected.
        followRepository.findByFollower_IdAndFollowing_Id(me.getId(), otherId)
                .ifPresent(followRepository::delete);
        followRepository.findByFollower_IdAndFollowing_Id(otherId, me.getId())
                .ifPresent(followRepository::delete);
        // A removed connection also clears the DM thread between the two users —
        // once disconnected they can no longer message each other, so the old
        // conversation shouldn't linger in either inbox.
        conversationRepository.findDirectBetween(me.getId(), otherId).ifPresent(conversation -> {
            messageRepository.deleteByConversation_Id(conversation.getId());
            conversationRepository.delete(conversation);
        });
    }

    @Override
    @Transactional
    public void block(Long userId) {
        User me = currentUser.currentUser(), other = user(userId);
        self(me, other);
        Connection c = connectionRepository.findBetween(me.getId(), other.getId()).orElse(new Connection());
        c.setRequester(me);
        c.setAddressee(other);
        c.setStatus(ConnectionStatus.BLOCKED);
        c.setBlockedBy(me);
        c.setRespondedAt(LocalDateTime.now());
        if (c.getRequestedAt() == null)
            c.setRequestedAt(LocalDateTime.now());
        connectionRepository.save(c);
        followRepository.findByFollower_IdAndFollowing_Id(me.getId(), other.getId())
                .ifPresent(followRepository::delete);
        followRepository.findByFollower_IdAndFollowing_Id(other.getId(), me.getId())
                .ifPresent(followRepository::delete);
    }

    @Override
    @Transactional
    public void unblock(Long userId) {
        User me = currentUser.currentUser();
        Connection c = connectionRepository.findBetween(me.getId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Blocked relationship not found"));
        if (c.getStatus() != ConnectionStatus.BLOCKED || c.getBlockedBy() == null
                || !c.getBlockedBy().getId().equals(me.getId()))
            throw new ForbiddenOperationException("Only the blocker can unblock this user");
        connectionRepository.delete(c);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConnectionResponse> connections() {
        return connectionRepository.findAcceptedForUser(currentUser.currentUser().getId()).stream().map(this::map)
                .filter(response -> response != null)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConnectionResponse> pendingReceived() {
        return connectionRepository.findByAddressee_IdAndStatusOrderByRequestedAtDesc(currentUser.currentUser().getId(),
                ConnectionStatus.PENDING).stream().map(this::map).filter(Objects::nonNull).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConnectionResponse> pendingSent() {
        return connectionRepository.findByRequester_IdAndStatusOrderByRequestedAtDesc(currentUser.currentUser().getId(),
                ConnectionStatus.PENDING).stream().map(this::map).filter(Objects::nonNull).toList();
    }

    @Override
    @Transactional
    public FollowResponse follow(Long userId) {
        User me = currentUser.currentUser(), other = user(userId);
        self(me, other);
        if (connectionRepository.areBlocked(me.getId(), other.getId()))
            throw new ForbiddenOperationException("Follow is blocked");
        if (followRepository.findByFollower_IdAndFollowing_Id(me.getId(), other.getId()).isPresent())
            throw new DuplicateResourceException("Already following this user");
        UserFollow f = followRepository.save(UserFollow.builder().follower(me).following(other).build());
        notificationService.create(other, me, NotificationType.NEW_FOLLOWER,
                profileLookup.displayName(me) + " started following you", "USER", me.getId());
        return map(f);
    }

    @Override
    @Transactional
    public void unfollow(Long userId) {
        User me = currentUser.currentUser();
        UserFollow f = followRepository.findByFollower_IdAndFollowing_Id(me.getId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Follow relationship not found"));
        followRepository.delete(f);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FollowResponse> followers() {
        return followRepository.findByFollowing_IdOrderByCreatedAtDesc(currentUser.currentUser().getId()).stream()
                .map(this::map).filter(Objects::nonNull).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<FollowResponse> following() {
        return followRepository.findByFollower_IdOrderByCreatedAtDesc(currentUser.currentUser().getId()).stream()
                .map(this::map).filter(Objects::nonNull).toList();
    }

    private User user(Long id) {
        User u = userRepository.findById(id).orElseThrow(() -> ResourceNotFoundException.of("User", id));
        if (u.isBlocked() || !u.isEnabled())
            throw new BadRequestException("User is unavailable");
        userVisibility.requirePublicUser(u);
        return u;
    }

    private void self(User a, User b) {
        if (a.getId().equals(b.getId()))
            throw new BadRequestException("You cannot perform this action on yourself");
    }

    private Connection conn(Long id) {
        Connection connection = connectionRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Connection", id));
        if (userVisibility.isAdmin(connection.getRequester()) || userVisibility.isAdmin(connection.getAddressee()))
            throw new ResourceNotFoundException("Connection not found");
        return connection;
    }

    private boolean member(Connection c, User u) {
        return c.getRequester().getId().equals(u.getId()) || c.getAddressee().getId().equals(u.getId());
    }

    private ConnectionResponse map(Connection c) {
        if (userVisibility.isAdmin(c.getRequester()) || userVisibility.isAdmin(c.getAddressee()))
            return null;
        return new ConnectionResponse(c.getId(), c.getRequester().getId(), profileLookup.displayName(c.getRequester()),
                profileLookup.profilePicture(c.getRequester()), c.getAddressee().getId(),
                profileLookup.displayName(c.getAddressee()), profileLookup.profilePicture(c.getAddressee()),
                c.getStatus(), c.getBlockedBy() == null ? null : c.getBlockedBy().getId(),
                c.getRequestedAt(), c.getRespondedAt());
    }

    private FollowResponse map(UserFollow f) {
        if (userVisibility.isAdmin(f.getFollower()) || userVisibility.isAdmin(f.getFollowing()))
            return null;
        return new FollowResponse(f.getId(), f.getFollower().getId(), profileLookup.displayName(f.getFollower()),
                profileLookup.profilePicture(f.getFollower()), f.getFollowing().getId(),
                profileLookup.displayName(f.getFollowing()), profileLookup.profilePicture(f.getFollowing()),
                f.getCreatedAt());
    }
}
