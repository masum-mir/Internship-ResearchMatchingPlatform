package com.ewu.matching.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "faculty")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Faculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String name;
    private String department;
    private String designation;
    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;
    @Column(name = "specialization", length = 255)
    private String specialization;
    @Column(name = "research_interests", columnDefinition = "TEXT")
    private String researchInterests;
    @Column(name = "contact_number")
    private String contactNumber;
    @Column(name = "university", length = 255)
    private String university;

    @Column(name = "profile_picture", length = 500)
    private String profilePicture;

    @Column(name = "cover_picture", length = 500)
    private String coverPicture;

    @Column(name = "google_scholar_url", length = 500)
    private String googleScholarUrl;
    @Column(name = "orcid_id", length = 100)
    private String orcidId;

    @Column(name = "researchgate_url", length = 500)
    private String researchgateUrl;

    @Column(name = "linkedin_url", length = 500)
    private String linkedinUrl;
    @Column(name = "university_profile_url", length = 500)
    private String universityProfileUrl;
    @OneToMany(mappedBy = "faculty", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ResearchOpportunity> researchOpportunities = new ArrayList<>();
}
