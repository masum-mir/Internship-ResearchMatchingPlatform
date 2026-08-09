package com.ewu.matching.entity;

import com.ewu.matching.enums.ConnectionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "connections", indexes = {
        @Index(name = "idx_connection_requester_status", columnList = "requester_id, status"),
        @Index(name = "idx_connection_addressee_status", columnList = "addressee_id, status")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Connection {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "addressee_id", nullable = false)
    private User addressee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ConnectionStatus status = ConnectionStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blocked_by_id")
    private User blockedBy;

    @Column(name = "requested_at", nullable = false, updatable = false)
    private LocalDateTime requestedAt;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @PrePersist void onCreate() {
        requestedAt = LocalDateTime.now();
        if (status == null) status = ConnectionStatus.PENDING;
    }
}
