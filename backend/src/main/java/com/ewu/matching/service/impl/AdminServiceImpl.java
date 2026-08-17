package com.ewu.matching.service.impl;

import com.ewu.matching.dto.request.AdminProfileRequest;
import com.ewu.matching.dto.request.AdminSetPasswordRequest;
import com.ewu.matching.dto.request.ChangeEmailRequest;
import com.ewu.matching.dto.request.ChangeNameRequest;
import com.ewu.matching.dto.request.ChangeRoleRequest;
import com.ewu.matching.dto.response.CommentResponse;
import com.ewu.matching.dto.response.ConversationResponse;
import com.ewu.matching.dto.response.MessageResponse;
import com.ewu.matching.dto.response.PostResponse;
import com.ewu.matching.dto.response.UserResponse;
import com.ewu.matching.entity.Comment;
import com.ewu.matching.entity.Company;
import com.ewu.matching.entity.Conversation;
import com.ewu.matching.entity.Faculty;
import com.ewu.matching.entity.Message;
import com.ewu.matching.entity.PostReaction;
import com.ewu.matching.entity.Role;
import com.ewu.matching.entity.Student;
import com.ewu.matching.entity.User;
import com.ewu.matching.entity.Post;
import com.ewu.matching.enums.OpportunityType;
import com.ewu.matching.enums.ReactionType;
import com.ewu.matching.enums.RoleType;
import com.ewu.matching.exception.BadRequestException;
import com.ewu.matching.exception.DuplicateResourceException;
import com.ewu.matching.exception.ResourceNotFoundException;
import com.ewu.matching.mapper.ProfileMapper;
import com.ewu.matching.repository.CommentRepository;
import com.ewu.matching.repository.CompanyRepository;
import com.ewu.matching.repository.ConversationRepository;
import com.ewu.matching.repository.FacultyRepository;
import com.ewu.matching.repository.InternshipRepository;
import com.ewu.matching.repository.MessageRepository;
import com.ewu.matching.repository.PostReactionRepository;
import com.ewu.matching.repository.PostShareRepository;
import com.ewu.matching.repository.RefreshTokenRepository;
import com.ewu.matching.repository.ResearchOpportunityRepository;
import com.ewu.matching.repository.RoleRepository;
import com.ewu.matching.repository.SavedPostRepository;
import com.ewu.matching.repository.StudentRepository;
import com.ewu.matching.repository.UserRepository;
import com.ewu.matching.repository.PostRepository;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.AdminService;
import com.ewu.matching.service.ProfileLookupService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final InternshipRepository internshipRepository;
    private final ResearchOpportunityRepository researchRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final CompanyRepository companyRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final PostRepository postRepository;
    private final PostReactionRepository reactionRepository;
    private final CommentRepository commentRepository;
    private final PostShareRepository shareRepository;
    private final SavedPostRepository savedRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ProfileLookupService profileLookup;
    private final CurrentUserProvider currentUser;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> listUsers() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponse> listAllPosts() {
        // Admin monitoring view: every non-deleted post on the platform,
        // regardless of author/visibility, newest first.
        User me = currentUser.currentUser();
        return postRepository.findByDeletedFalseOrderByCreatedAtDesc().stream().map(p -> mapPost(p, me)).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PostResponse getSocialPost(Long id) {
        // Admin monitoring view: fetch a single post regardless of author,
        // visibility, or deleted state, so a reported post can be reviewed
        // even after the author deletes it (content will read null in that case).
        User me = currentUser.currentUser();
        Post post = postRepository.findById(id).orElseThrow(() -> ResourceNotFoundException.of("Post", id));
        return mapPost(post, me);
    }

    @Override
    @Transactional(readOnly = true)
    public CommentResponse getComment(Long id) {
        // Admin monitoring view: fetch a single comment regardless of the
        // parent post's visibility/author, so a reported comment can be
        // reviewed with its post context even if the comment is later deleted
        // (content will read "[deleted]" in that case, same as the public API).
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Comment", id));
        return mapComment(comment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversationResponse> listAllConversations() {
        // Admin monitoring view: every direct-message conversation on the
        // platform, so an admin can see who is talking to whom.
        return conversationRepository.findAllByOrderByUpdatedAtDesc().stream().map(this::mapConversation).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> listConversationMessages(Long conversationId) {
        if (!conversationRepository.existsById(conversationId)) {
            throw ResourceNotFoundException.of("Conversation", conversationId);
        }
        return messageRepository.findByConversation_IdOrderBySentAtAsc(conversationId).stream().map(this::mapMessage)
                .toList();
    }

    @Override
    @Transactional
    public UserResponse blockUser(Long userId) {
        return setBlocked(userId, true);
    }

    @Override
    @Transactional
    public UserResponse unblockUser(Long userId) {
        return setBlocked(userId, false);
    }

    private UserResponse setBlocked(Long userId, boolean blocked) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
        user.setBlocked(blocked);
        return toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deletePost(OpportunityType type, Long postId) {
        if (type == OpportunityType.INTERNSHIP) {
            if (!internshipRepository.existsById(postId)) {
                throw ResourceNotFoundException.of("Internship", postId);
            }
            internshipRepository.deleteById(postId);
        } else {
            if (!researchRepository.existsById(postId)) {
                throw ResourceNotFoundException.of("Research opportunity", postId);
            }
            researchRepository.deleteById(postId);
        }
    }

    @Override
    @Transactional
    public void deleteSocialPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> ResourceNotFoundException.of("Post", postId));
        post.setDeleted(true);
        post.setContent(null);
        post.setMediaUrl(null);
        postRepository.save(post);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getMyProfile() {
        return toResponse(currentUser.currentUser());
    }

    @Override
    @Transactional
    public UserResponse updateMyProfile(AdminProfileRequest req) {
        User u = currentUser.currentUser();
        return toResponse(userRepository.save(u));
    }

    @Override
    @Transactional
    public UserResponse changeUserEmail(Long userId, ChangeEmailRequest req) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
        String newEmail = req.email().trim();
        if (!newEmail.equalsIgnoreCase(u.getEmail()) && userRepository.existsByEmail(newEmail)) {
            throw new DuplicateResourceException("Email already in use: " + newEmail);
        }
        u.setEmail(newEmail);
        return toResponse(userRepository.save(u));
    }

    @Override
    @Transactional
    public UserResponse changeUserName(Long userId, ChangeNameRequest req) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
        String newName = req.name().trim();

        // The display name lives on the role-specific profile row (Student /
        // Faculty / Company), not on User itself — update whichever exists.
        var student = studentRepository.findByUser_Id(userId);
        var faculty = facultyRepository.findByUser_Id(userId);
        var company = companyRepository.findByUser_Id(userId);

        if (student.isPresent()) {
            student.get().setName(newName);
            studentRepository.save(student.get());
        } else if (faculty.isPresent()) {
            faculty.get().setName(newName);
            facultyRepository.save(faculty.get());
        } else if (company.isPresent()) {
            company.get().setCompanyName(newName);
            companyRepository.save(company.get());
        } else {
            throw new BadRequestException(
                    "This user has no editable profile (no student, faculty, or company record).");
        }
        return toResponse(u);
    }

    @Override
    @Transactional
    public UserResponse changeUserRole(Long userId, ChangeRoleRequest req) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
        RoleType newRoleType = req.role();

        boolean wasAdmin = u.getRoles().stream().anyMatch(r -> r.getName() == RoleType.ADMIN);
        if (wasAdmin) {
            throw new BadRequestException("Administrator roles cannot be changed.");
        }

        // Carry the existing display name over to the new role's profile row,
        // if one doesn't already exist for it, so it doesn't come out blank.
        String existingName = resolveName(u);

        Role role = roleRepository.findByName(newRoleType)
                .orElseGet(() -> roleRepository.save(Role.builder().name(newRoleType).build()));
        u.setRoles(new HashSet<>(Set.of(role)));
        userRepository.save(u);

        switch (newRoleType) {
            case STUDENT -> {
                if (studentRepository.findByUser_Id(userId).isEmpty()) {
                    studentRepository.save(Student.builder().user(u).name(existingName).build());
                }
            }
            case FACULTY -> {
                if (facultyRepository.findByUser_Id(userId).isEmpty()) {
                    facultyRepository.save(Faculty.builder().user(u).name(existingName).build());
                }
            }
            case COMPANY -> {
                if (companyRepository.findByUser_Id(userId).isEmpty()) {
                    companyRepository.save(Company.builder().user(u).companyName(existingName).build());
                }
            }
            case ADMIN -> {
                /* no dedicated profile row for admins */ }
        }

        return toResponse(u);
    }

    @Override
    @Transactional
    public UserResponse changeUserPassword(Long userId, AdminSetPasswordRequest req) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
        u.setPassword(passwordEncoder.encode(req.newPassword()));
        userRepository.save(u);
        // Force re-authentication everywhere by revoking all refresh tokens.
        refreshTokenRepository.deleteByUser(u);
        return toResponse(u);
    }

    @Override
    @Transactional
    public UserResponse setCredentialsSelfEdit(Long userId, com.ewu.matching.dto.request.SelfEditPermissionRequest req) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
        u.setCredentialsSelfEditEnabled(req.enabled());
        return toResponse(userRepository.save(u));
    }

    // ---------- helpers ----------

    private UserResponse toResponse(User u) {
        return ProfileMapper.toUserResponse(u, resolveName(u));
    }

    private PostResponse mapPost(Post p, User viewer) {
        var summary = profileLookup.summary(p.getAuthor());
        EnumMap<ReactionType, Long> breakdown = new EnumMap<>(ReactionType.class);
        for (ReactionType t : ReactionType.values())
            breakdown.put(t, 0L);
        for (PostReaction r : reactionRepository.findByPost_Id(p.getId()))
            breakdown.put(r.getType(), breakdown.get(r.getType()) + 1);
        ReactionType mine = reactionRepository.findByPost_IdAndUser_Id(p.getId(), viewer.getId())
                .map(PostReaction::getType).orElse(null);
        return new PostResponse(p.getId(), p.getAuthor().getId(), summary.name(), summary.role(),
                summary.profilePicture(), p.getContent(), p.getMediaUrl(), p.getMediaType(),
                p.getVisibility(), p.isEdited(), p.getCreatedAt(), p.getUpdatedAt(),
                reactionRepository.countByPost_Id(p.getId()), breakdown,
                commentRepository.countByPost_IdAndDeletedFalse(p.getId()), shareRepository.countByPost_Id(p.getId()),
                mine, savedRepository.existsByUser_IdAndPost_Id(viewer.getId(), p.getId()));
    }

    private CommentResponse mapComment(Comment c) {
        var s = profileLookup.summary(c.getAuthor());
        return new CommentResponse(c.getId(), c.getPost().getId(), c.getAuthor().getId(), s.name(), s.profilePicture(),
                c.getParentComment() == null ? null : c.getParentComment().getId(), c.getContent(), c.isEdited(),
                c.getCreatedAt(), c.getUpdatedAt());
    }

    private ConversationResponse mapConversation(Conversation c) {
        return new ConversationResponse(c.getId(),
                c.getParticipants().stream().map(profileLookup::summary).collect(Collectors.toSet()),
                c.getCreatedAt(), c.getUpdatedAt());
    }

    private MessageResponse mapMessage(Message m) {
        return new MessageResponse(m.getId(), m.getConversation().getId(), m.getSender().getId(),
                profileLookup.displayName(m.getSender()), m.getContent(), m.getAttachmentUrl(), m.isRead(),
                m.getSentAt(), m.getReadAt());
    }

    private String resolveName(User u) {
        return studentRepository.findByUser_Id(u.getId()).map(Student::getName)
                .or(() -> facultyRepository.findByUser_Id(u.getId()).map(Faculty::getName))
                .or(() -> companyRepository.findByUser_Id(u.getId()).map(Company::getCompanyName))
                .orElse("Admin");
    }
}
