package com.ewu.matching.entity;

import com.ewu.matching.enums.CredentialChangeStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "credential_change_requests", indexes = {
        @Index(name = "idx_credential_change_requests_status", columnList = "status"),
        @Index(name = "idx_credential_change_requests_user", columnList = "user_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CredentialChangeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Null when this request doesn't ask for an email change.
    @Column(name = "requested_email")
    private String requestedEmail;

    // Already hashed with the same PasswordEncoder used everywhere else —
    // never store the plaintext password. Null when this request doesn't ask
    // for a password change.
    @Column(name = "requested_password_hash")
    private String requestedPasswordHash;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 20)
    private CredentialChangeStatus status = CredentialChangeStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by_id")
    private User resolvedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
