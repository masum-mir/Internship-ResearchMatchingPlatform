package com.ewu.matching.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages", indexes = @Index(name = "idx_message_conversation_sent", columnList = "conversation_id, sent_at"))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Message {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    @Column(name = "attachment_url", length = 500)
    private String attachmentUrl;
    @Builder.Default @Column(name = "read_flag", nullable = false)
    private boolean read = false;
    @Column(name = "sent_at", nullable = false, updatable = false)
    private LocalDateTime sentAt;
    @Column(name = "read_at")
    private LocalDateTime readAt;
    @PrePersist void onCreate() { sentAt = LocalDateTime.now(); }
}
