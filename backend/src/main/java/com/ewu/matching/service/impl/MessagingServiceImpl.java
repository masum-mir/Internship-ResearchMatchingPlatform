package com.ewu.matching.service.impl;

import com.ewu.matching.dto.response.*;
import com.ewu.matching.entity.*;
import com.ewu.matching.enums.NotificationType;
import com.ewu.matching.exception.*;
import com.ewu.matching.repository.*;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessagingServiceImpl implements MessagingService {
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;
    private final CurrentUserProvider currentUser;
    private final ProfileLookupService profileLookup;
    private final NotificationService notificationService;
    private final UserVisibilityService userVisibility;

    @Override
    @Transactional
    public ConversationResponse startDirect(Long otherUserId) {
        User me = currentUser.currentUser();
        User other = userRepository.findById(otherUserId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", otherUserId));
        userVisibility.requirePublicUser(other);
        if (me.getId().equals(other.getId()))
            throw new BadRequestException("Cannot message yourself");
        if (connectionRepository.areBlocked(me.getId(), other.getId()))
            throw new ForbiddenOperationException("Messaging is blocked between these users");
        if (!connectionRepository.areConnected(me.getId(), other.getId()))
            throw new ForbiddenOperationException("You need to be connected with this person before you can message them");
        for (Conversation c : conversationRepository.findDistinctByParticipants_IdOrderByUpdatedAtDesc(me.getId())) {
            Set<Long> ids = c.getParticipants().stream().map(User::getId).collect(Collectors.toSet());
            if (ids.size() == 2 && ids.contains(me.getId()) && ids.contains(other.getId()))
                return map(c);
        }
        Set<User> ps = new HashSet<>();
        ps.add(me);
        ps.add(other);
        return map(conversationRepository.save(Conversation.builder().participants(ps).build()));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversationResponse> conversations() {
        return conversationRepository
                .findDistinctByParticipants_IdOrderByUpdatedAtDesc(currentUser.currentUser().getId()).stream()
                .filter(this::hasOnlyPublicParticipants)
                .map(this::map).toList();
    }

    @Override
    @Transactional
    public MessageResponse send(Long conversationId, String content, String attachmentUrl) {
        User me = currentUser.currentUser();
        Conversation c = member(conversationId, me);
        if ((content == null || content.isBlank()) && (attachmentUrl == null || attachmentUrl.isBlank()))
            throw new BadRequestException("Message must contain text or attachment");
        for (User p : c.getParticipants()) {
            if (p.getId().equals(me.getId()))
                continue;
            if (connectionRepository.areBlocked(me.getId(), p.getId()))
                throw new ForbiddenOperationException("Messaging is blocked");
            if (!connectionRepository.areConnected(me.getId(), p.getId()))
                throw new ForbiddenOperationException("You need to be connected with this person to send messages");
        }
        Message m = messageRepository.save(Message.builder().conversation(c).sender(me)
                .content(content == null || content.isBlank() ? "[attachment]" : content.trim())
                .attachmentUrl(clean(attachmentUrl)).build());
        c.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(c);
        for (User p : c.getParticipants())
            if (!p.getId().equals(me.getId()))
                notificationService.create(p, me, NotificationType.NEW_MESSAGE,
                        "New message from " + profileLookup.displayName(me), "CONVERSATION", c.getId());
        return map(m);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> messages(Long conversationId) {
        User me = currentUser.currentUser();
        member(conversationId, me);
        return messageRepository.findByConversation_IdOrderBySentAtAsc(conversationId).stream().map(this::map).toList();
    }

    @Override
    @Transactional
    public void markRead(Long conversationId) {
        User me = currentUser.currentUser();
        member(conversationId, me);
        LocalDateTime now = LocalDateTime.now();
        messageRepository.findByConversation_IdOrderBySentAtAsc(conversationId).stream()
                .filter(m -> !m.getSender().getId().equals(me.getId()) && !m.isRead()).forEach(m -> {
                    m.setRead(true);
                    m.setReadAt(now);
                });
    }

    private Conversation member(Long id, User me) {
        Conversation c = conversationRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Conversation", id));
        if (c.getParticipants().stream().noneMatch(u -> u.getId().equals(me.getId())))
            throw new ForbiddenOperationException("You are not a participant");
        if (!hasOnlyPublicParticipants(c))
            throw new ResourceNotFoundException("Conversation not found");
        return c;
    }

    private boolean hasOnlyPublicParticipants(Conversation conversation) {
        return conversation.getParticipants().stream().noneMatch(userVisibility::isAdmin);
    }

    private ConversationResponse map(Conversation c) {
        return new ConversationResponse(c.getId(),
                c.getParticipants().stream().map(profileLookup::summary).collect(Collectors.toSet()), c.getCreatedAt(),
                c.getUpdatedAt());
    }

    private MessageResponse map(Message m) {
        return new MessageResponse(m.getId(), m.getConversation().getId(), m.getSender().getId(),
                profileLookup.displayName(m.getSender()), m.getContent(), m.getAttachmentUrl(), m.isRead(),
                m.getSentAt(), m.getReadAt());
    }

    private String clean(String s) {
        if (s == null)
            return null;
        String v = s.trim();
        return v.isEmpty() ? null : v;
    }
}
