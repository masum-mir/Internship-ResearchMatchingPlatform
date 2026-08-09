package com.ewu.matching.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "skill_endorsements", uniqueConstraints = @UniqueConstraint(
        name = "uk_skill_endorsement", columnNames = {"student_id", "skill_id", "endorsed_by_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SkillEndorsement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "endorsed_by_id", nullable = false)
    private User endorsedBy;
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @PrePersist void onCreate() { createdAt = LocalDateTime.now(); }
}
