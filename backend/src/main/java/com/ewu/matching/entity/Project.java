package com.ewu.matching.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    private String title;
    @Column(columnDefinition = "TEXT") private String description;
    @Column(length = 500) private String link;
    @Column(name = "repository_url", length = 500) private String repositoryUrl;
    @Column(name = "tech_stack", length = 1000) private String techStack;
    @Column(name = "start_date") private LocalDate startDate;
    @Column(name = "end_date") private LocalDate endDate;
}
