package com.ewu.matching.entity;

import com.ewu.matching.enums.EmploymentType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "experiences")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Experience {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(nullable = false) private String title;
    @Column(name = "organization_name", nullable = false) private String organizationName;
    @Enumerated(EnumType.STRING) @Column(name = "employment_type", length = 30)
    private EmploymentType employmentType;
    private String location;
    @Column(name = "start_date") private LocalDate startDate;
    @Column(name = "end_date") private LocalDate endDate;
    @Builder.Default @Column(name = "currently_working", nullable = false)
    private boolean currentlyWorking = false;
    @Column(columnDefinition = "TEXT") private String description;
}
