package com.ewu.matching.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "company_name")
    private String companyName;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String website;
    private String location;

    @Column(length = 120)
    private String industry;

    @Column(name = "company_size", length = 50)
    private String companySize;

    @Column(name = "founded_date")
    private LocalDate foundedDate;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "company_email", length = 255)
    private String companyEmail;

    @Column(name = "profile_picture", length = 500)
    private String profilePicture;

    @Column(name = "cover_picture", length = 500)
    private String coverPicture;

    @Builder.Default
    @Column(nullable = false)
    private boolean verified = false;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Internship> internships = new ArrayList<>();
}
