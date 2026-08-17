package com.ewu.matching.service.impl;

import com.ewu.matching.dto.request.CredentialChangeRequestPayload;
import com.ewu.matching.dto.response.CredentialChangeRequestResponse;
import com.ewu.matching.entity.CredentialChangeRequest;
import com.ewu.matching.entity.User;
import com.ewu.matching.enums.CredentialChangeStatus;
import com.ewu.matching.enums.NotificationType;
import com.ewu.matching.enums.RoleType;
import com.ewu.matching.exception.BadRequestException;
import com.ewu.matching.exception.DuplicateResourceException;
import com.ewu.matching.exception.ResourceNotFoundException;
import com.ewu.matching.repository.CredentialChangeRequestRepository;
import com.ewu.matching.repository.RefreshTokenRepository;
import com.ewu.matching.repository.UserRepository;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.CredentialChangeService;
import com.ewu.matching.service.NotificationService;
import com.ewu.matching.service.ProfileLookupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CredentialChangeServiceImpl implements CredentialChangeService {

    private final CredentialChangeRequestRepository credentialChangeRequestRepository;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserProvider currentUserProvider;
    private final ProfileLookupService profileLookupService;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public CredentialChangeRequestResponse submit(CredentialChangeRequestPayload request) {
        User user = currentUserProvider.currentUser();

        String email = request.email() != null && !request.email().isBlank() ? request.email().trim() : null;
        String password = request.password() != null && !request.password().isBlank() ? request.password() : null;
        if (email == null && password == null) {
            throw new BadRequestException("Provide a new email and/or a new password");
        }
        if (email != null || password != null) {
            // Changing login credentials is security-sensitive, so re-verify the
            // account's current password before applying either change — same as
            // the direct /auth/password flow.
            if (request.currentPassword() == null || request.currentPassword().isBlank()) {
                throw new BadRequestException("Current password is required to change your email or password");
            }
            if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
                throw new BadRequestException("Current password is incorrect");
            }
        }
        if (email != null && !email.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email already in use: " + email);
        }

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == RoleType.ADMIN);

        if (isAdmin || user.isCredentialsSelfEditEnabled()) {
            // Self-edit is allowed for this account — apply the change right away
            // instead of routing it through admin approval.
            if (email != null) {
                user.setEmail(email);
            }
            if (password != null) {
                user.setPassword(passwordEncoder.encode(password));
            }
            userRepository.save(user);
            if (password != null) {
                // Force re-authentication everywhere by revoking all refresh tokens,
                // same as the direct password-change and admin-set-password flows.
                refreshTokenRepository.deleteByUser(user);
            }
            LocalDateTime now = LocalDateTime.now();
            return new CredentialChangeRequestResponse(null, user.getId(), user.getEmail(),
                    profileLookupService.displayName(user), email, password != null,
                    CredentialChangeStatus.APPROVED, now, now);
        }

        if (credentialChangeRequestRepository.existsByUser_IdAndStatus(user.getId(), CredentialChangeStatus.PENDING)) {
            throw new BadRequestException("You already have a pending credential change request awaiting admin review");
        }

        CredentialChangeRequest req = CredentialChangeRequest.builder()
                .user(user)
                .requestedEmail(email)
                .requestedPasswordHash(password != null ? passwordEncoder.encode(password) : null)
                .status(CredentialChangeStatus.PENDING)
                .build();
        CredentialChangeRequest saved = credentialChangeRequestRepository.save(req);
        notifyAdmins(user, saved);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CredentialChangeRequestResponse> mine() {
        User user = currentUserProvider.currentUser();
        return credentialChangeRequestRepository.findByUser_IdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CredentialChangeRequestResponse> list(String status) {
        List<CredentialChangeRequest> requests;
        if (status == null || status.isBlank() || "ALL".equalsIgnoreCase(status)) {
            requests = credentialChangeRequestRepository.findAllByOrderByCreatedAtDesc();
        } else {
            CredentialChangeStatus parsed;
            try {
                parsed = CredentialChangeStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Unknown request status: " + status);
            }
            requests = credentialChangeRequestRepository.findByStatusOrderByCreatedAtDesc(parsed);
        }
        return requests.stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public CredentialChangeRequestResponse approve(Long requestId) {
        CredentialChangeRequest req = credentialChangeRequestRepository.findById(requestId)
                .orElseThrow(() -> ResourceNotFoundException.of("CredentialChangeRequest", requestId));
        requirePending(req);

        User user = req.getUser();
        if (req.getRequestedEmail() != null) {
            if (!req.getRequestedEmail().equalsIgnoreCase(user.getEmail())
                    && userRepository.existsByEmail(req.getRequestedEmail())) {
                throw new DuplicateResourceException("Email already in use: " + req.getRequestedEmail());
            }
            user.setEmail(req.getRequestedEmail());
        }
        boolean passwordChanged = req.getRequestedPasswordHash() != null;
        if (passwordChanged) {
            user.setPassword(req.getRequestedPasswordHash());
        }
        userRepository.save(user);
        if (passwordChanged) {
            refreshTokenRepository.deleteByUser(user);
        }

        req.setStatus(CredentialChangeStatus.APPROVED);
        req.setResolvedAt(LocalDateTime.now());
        req.setResolvedBy(currentUserProvider.currentUser());
        CredentialChangeRequest saved = credentialChangeRequestRepository.save(req);
        notifyRequester(saved);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public CredentialChangeRequestResponse reject(Long requestId) {
        CredentialChangeRequest req = credentialChangeRequestRepository.findById(requestId)
                .orElseThrow(() -> ResourceNotFoundException.of("CredentialChangeRequest", requestId));
        requirePending(req);

        req.setStatus(CredentialChangeStatus.REJECTED);
        req.setResolvedAt(LocalDateTime.now());
        req.setResolvedBy(currentUserProvider.currentUser());
        CredentialChangeRequest saved = credentialChangeRequestRepository.save(req);
        notifyRequester(saved);
        return toResponse(saved);
    }

    // ---------- helpers ----------

    private void requirePending(CredentialChangeRequest req) {
        if (req.getStatus() != CredentialChangeStatus.PENDING) {
            throw new BadRequestException("This request has already been " + req.getStatus().name().toLowerCase());
        }
    }

    // Every admin gets a notification when a self-edit-disabled user requests a
    // credential change. Best-effort side effect: failures here must never take
    // the request itself down with it (mirrors ContentReportServiceImpl.notifyAdmins).
    private void notifyAdmins(User requester, CredentialChangeRequest req) {
        try {
            String requesterName = profileLookupService.displayName(requester);
            String what = req.getRequestedEmail() != null && req.getRequestedPasswordHash() != null
                    ? "email and password" : req.getRequestedEmail() != null ? "email" : "password";
            String messageText = requesterName + " requested a " + what + " change";

            List<User> admins = userRepository.findByRoles_Name(RoleType.ADMIN);
            for (User admin : admins) {
                notificationService.create(admin, requester, NotificationType.CREDENTIAL_CHANGE_REQUESTED,
                        messageText, "CREDENTIAL_CHANGE_REQUEST", req.getId());
            }
        } catch (Exception e) {
            log.error("Failed to notify admins about credential change request {} (request itself still saved): ",
                    req.getId(), e);
        }
    }

    // Lets the requester know once an admin has approved or rejected their
    // request. Best-effort side effect, same reasoning as notifyAdmins above.
    private void notifyRequester(CredentialChangeRequest req) {
        try {
            String messageText = "Your credential change request was " + req.getStatus().name().toLowerCase() + ".";
            notificationService.create(req.getUser(), currentUserProvider.currentUser(),
                    NotificationType.CREDENTIAL_CHANGE_RESOLVED, messageText, "CREDENTIAL_CHANGE_REQUEST",
                    req.getId());
        } catch (Exception e) {
            log.error("Failed to notify user about credential change resolution {} (resolution itself still saved): ",
                    req.getId(), e);
        }
    }

    private CredentialChangeRequestResponse toResponse(CredentialChangeRequest r) {
        return new CredentialChangeRequestResponse(
                r.getId(),
                r.getUser().getId(),
                r.getUser().getEmail(),
                profileLookupService.displayName(r.getUser()),
                r.getRequestedEmail(),
                r.getRequestedPasswordHash() != null,
                r.getStatus(),
                r.getCreatedAt(),
                r.getResolvedAt()
        );
    }
}
