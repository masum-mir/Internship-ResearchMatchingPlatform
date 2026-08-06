package com.ewu.matching.entity;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(length = 1000)
    private String description;

    private String website;
    private String location;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "profile_picture", length = 500)
    private String profilePicture;

    @Column(name = "cover_picture", length = 500)
    private String coverPicture;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Internship> internships = new ArrayList<>();
}
