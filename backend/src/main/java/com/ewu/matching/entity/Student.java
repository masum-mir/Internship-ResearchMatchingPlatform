package com.ewu.matching.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "student_id", unique = true)
    private String studentId;

    private String name;
    private String department;

    @Column(precision = 4, scale = 2)
    private BigDecimal cgpa;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(length = 500)
    private String address;

    @Column(name = "profile_picture", length = 500)
    private String profilePicture;

    @Column(name = "cover_picture", length = 500)
    private String coverPicture;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "student_skills",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private Set<Skill> skills = new HashSet<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Project> projects = new HashSet<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Certification> certifications = new HashSet<>();

    @OneToMany(mappedBy = "student")
    private Set<Application> applications;

    @OneToMany(mappedBy = "student")
    private Set<Bookmark> bookmarks;
}
