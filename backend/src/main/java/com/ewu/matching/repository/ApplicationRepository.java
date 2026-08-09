package com.ewu.matching.repository;

import com.ewu.matching.entity.Application;
import com.ewu.matching.enums.ApplicationStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    @EntityGraph(attributePaths = { "internship", "internship.company", "research", "research.faculty" })
    List<Application> findByStudent_Id(Long studentId);

    boolean existsByStudent_IdAndInternship_IdAndStatusNot(Long studentId, Long internshipId, ApplicationStatus status);

    boolean existsByStudent_IdAndResearch_IdAndStatusNot(Long studentId, Long researchId, ApplicationStatus status);

    long countByStudent_Id(Long studentId);

    long countByStudent_IdAndStatus(Long studentId, ApplicationStatus status);

    @EntityGraph(attributePaths = { "student", "student.user" })
    List<Application> findByInternship_Id(Long internshipId);

    @EntityGraph(attributePaths = { "student", "student.user" })
    List<Application> findByResearch_Id(Long researchId);

    long countByInternship_Company_Id(Long companyId);

    long countByResearch_Faculty_Id(Long facultyId);

    long countByStatus(ApplicationStatus status);

    @Query("""
            SELECT a.internship.id, COUNT(a) FROM Application a
            WHERE a.internship IS NOT NULL GROUP BY a.internship.id ORDER BY COUNT(a) DESC
            """)
    List<Object[]> findMostAppliedInternships(Pageable pageable);
}
